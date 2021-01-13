import React, { useCallback, useEffect, useState } from 'react';
import { BiCameraMovie } from 'react-icons/bi';
import { RiMovie2Line, RiMenu5Line, RiSearchLine } from 'react-icons/ri';

import MediaListsPage from '../components/media-lists-page';
import SearchForMedia from '../components/search';
import Settings from './settings';

import dashboardStyle from '../stylesheets/pages/dashboard.module.scss';
import selectorStyle from '../stylesheets/components/list-types-selector.module.scss';

import { fetchOrDeleteFromApi } from '../helpers/common';
import { animated, useSpring } from "react-spring";

export default function Dashboard (props) {
    const {user, updateUser, mediaPref, listPref} = props;
    // state for current page
    const [currentPage, setCurrentPage] = useState('movies');
    // state to block overflow and background details when there's a popup activity
    const [blockAppOverflow, setBlockAppOverflow] = useState(false);
    // state for storing all lists
    const [allLists, setAllLists] = useState({empty: true});
    // state to prevent extra get List fetches
    const [updatingLists, setUpdatingLists] = useState(false);
    // state for list names (no media details)
    const [movieListNames, setMovieListNames] = useState([]);
    const [tvListNames, setTvListNames] = useState([]);
    const [allowLoadCompletedLists, setAllowLoadCompletedLists] = useState(false);
    const [completedLists, setCompletedLists] = useState({});
    const [refreshCompletedLists, setRefreshCompletedLists] = useState(0);
    // function to handle blockAppOverflow state change
    useEffect(() => {
        const App = document.getElementsByTagName('body')[0];
        if (blockAppOverflow) {
            App.style.overflow = "hidden";
        } else {
            App.style.overflow = "auto";
        }
    }, [blockAppOverflow]);
    // function to update lists. Not used for initial render
    const getLists = (listCategory) => {
        if (updatingLists) return
        setUpdatingLists(true);
        return fetchOrDeleteFromApi(`lists/${listCategory}`, 'get')
            .then(lists => {
                setAllLists({...allLists, [listCategory]: lists})
            })
            .catch(err => console.log(err))
            .finally(() => {
                setUpdatingLists(false)
            });
    }
    // function to get completed lists
    useEffect(() => {
        if (allowLoadCompletedLists) {
            fetchOrDeleteFromApi('lists/completed', 'get')
                .then(results => setCompletedLists(results))
                .catch(err => console.log(err));
        }
    }, [allowLoadCompletedLists, refreshCompletedLists]);
    const updateCompletedList = () => {
        setRefreshCompletedLists(refreshCompletedLists+1);
    }
    // function to update list names
    const refreshListNames = useCallback(
        async function refreshListNames() {
            if (!user) return
            fetchOrDeleteFromApi('lists/getAllTvListNames', 'get')
                .then(result => setTvListNames(result))
                .catch(err => console.log(err))
            fetchOrDeleteFromApi('lists/getAllListNames', 'get')
                .then(result => setMovieListNames(result))
                .catch(err => console.log(err));
        },
        [user]
    );
    // refresh list names on initial render
    useEffect(() => {
        if (!user) return
        refreshListNames()
            .catch(err => console.log(err));
    }, [refreshListNames, user]);
    /*
        get lists on initial render
        different function to the getLists because I was unable to solve an
        issue of this component re-rendering too many times and calling the
        function multiple times on 1 render
    */
    useEffect(() => {
        if (!user) return
        setUpdatingLists(true);
        async function initialGetLists() {
            const movieLists =
                await fetchOrDeleteFromApi(`lists/towatch`, 'get')
                    .catch(err => console.log(err))
            const tvLists =
                await fetchOrDeleteFromApi(`lists/towatchtv`, 'get')
                    .catch(err => console.log(err))
            setAllLists({towatch: movieLists, towatchtv: tvLists});
            setUpdatingLists(false);
            setAllowLoadCompletedLists(true);
        }

        initialGetLists()
            .catch(err => console.log(err));
    }, [user])
    // function to change the current pages state - used by page selector
    const handlePages = (newPage, title) => {
        if (newPage === currentPage) return
        setCurrentPage(newPage);
        document.title = `MyMediaLists - ${title}`;
    }
    const handleUpdatedList = (listCategory) => {
        getLists(listCategory)
            .then(refreshListNames)
            .then(updateCompletedList);
    }
    if (!user) return (
        <h1 className={dashboardStyle.noUserMessage}>
            Sign up or login to manage your media lists
        </h1>
    )
    return (
        <>
            <div id="appDashboard" className={dashboardStyle.dashboard}>
                <PageTransition isCurrentPage={currentPage === 'movies'}>
                    <MediaListsPage
                        listCategory="towatch"
                        allLists={allLists.towatch}
                        listPref={listPref}
                        mediaPref={mediaPref}
                        getLists={getLists}
                        refreshList={handleUpdatedList}
                        tvListNames={tvListNames}
                        movieListNames={movieListNames}
                        completedList={completedLists.completedLists}
                        updateCompletedList={updateCompletedList}
                        setBlockAppOverflow={setBlockAppOverflow}
                    />
                </PageTransition>
                <PageTransition isCurrentPage={currentPage === 'tvShows'}>
                    <MediaListsPage
                        listCategory="towatchtv"
                        allLists={allLists.towatchtv}
                        listPref={listPref}
                        mediaPref={mediaPref}
                        getLists={getLists}
                        refreshList={handleUpdatedList}
                        tvListNames={tvListNames}
                        movieListNames={movieListNames}
                        completedList={completedLists.completedListsTv}
                        updateCompletedList={updateCompletedList}
                        setBlockAppOverflow={setBlockAppOverflow}
                    />
                </PageTransition>
                <PageTransition isCurrentPage={currentPage === 'search'}>
                    <SearchForMedia
                        currentPage={currentPage}
                        isSpecificList={false}
                        refreshList={handleUpdatedList}
                        tvListNames={tvListNames}
                        movieListNames={movieListNames}
                    />
                </PageTransition>
                <PageTransition isCurrentPage={currentPage === 'settings'}>
                    <Settings
                        refreshList={handleUpdatedList}
                        tvListNames={tvListNames}
                        movieListNames={movieListNames}
                        listPref={listPref}
                        mediaPref={mediaPref}
                        updateUser={updateUser}
                    />
                </PageTransition>
            </div>
            <div
                style={{height: "65px"}}
                className={currentPage === 'settings' ? dashboardStyle.compensateMobileBottom : undefined}/>
            <PageSelector
                currentPage={currentPage}
                handlePages={handlePages}
            />
        </>
    )
}

function PageTransition (props) {
    const {isCurrentPage, children} = props;
    const spring = useSpring({
        to: {
            position: isCurrentPage ? 'relative' : 'absolute',
            overflow: isCurrentPage ? 'none' : 'hidden',
            top: isCurrentPage ? 0: 0,
            opacity: isCurrentPage ? 1 : 0,
            height: isCurrentPage ? 'fit-content' : 0,
        }
    });
    return (
        <animated.div style={spring}>
            {children}
        </animated.div>
    )
}

function PageSelector (props) {
    const {currentPage} = props;
    const handlePageChange = (newPage, title) => {
        return ( () => {props.handlePages(newPage, title)} );
    }
    const pages = [
        {
            value: 'movies',
            text: 'Movies',
            icon: <BiCameraMovie />
        },
        {
            value: 'tvShows',
            text: 'Tv Shows',
            icon: <RiMovie2Line />
        },
        {
            value: 'search',
            text: 'Search',
            icon: <RiSearchLine />
        },
        {
            value: 'settings',
            text: 'Menu',
            icon: <RiMenu5Line />
        }
    ]
    return (
        <div className={selectorStyle.selectorWrapper}>
            <div className={selectorStyle.selectorContainer}>
                {
                    pages.map(page => (
                        <button
                            key={page.value}
                            onClick={handlePageChange(page.value, page.text)}
                            className={
                                `${selectorStyle.selectorButton} 
                                ${currentPage === page.value ? selectorStyle.activeCategory : undefined}`
                            }
                        >
                            <div className={selectorStyle.imageContainer}>
                                {page.icon}
                            </div>
                            <div>{page.text}</div>
                        </button>
                    ))
                }
            </div>
            {/*Raise on fullscreen to compensate for ios/android non removable nav gesture ui bar*/}
            <div className={selectorStyle.raiseOnFullscreen} />
        </div>
    )
}