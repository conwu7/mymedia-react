import React, {useCallback, useEffect, useState} from 'react';
import {BiCameraMovie} from 'react-icons/bi';
import {RiMenu5Line, RiMovie2Line, RiSearchLine} from 'react-icons/ri';

import MediaListsPage from '../components/media-lists-page';
import SearchForMedia from '../components/search';
import {ComponentPageTransition} from "../components/common";
import Settings from './settings';

import dashboardStyle from '../stylesheets/pages/dashboard.module.scss';
import selectorStyle from '../stylesheets/components/list-types-selector.module.scss';

import {fetchOrDeleteFromApi} from '../helpers/common';
import SiteSample from "../components/site-samples";

export default function Dashboard (props) {
    const {user, updateUser, mediaPref, listPref, defaultMediaPage} = props;
    // state for current page
    const [currentPage, setCurrentPage] = useState(defaultMediaPage || 'movies');
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
        <>

            <SiteSample />
        </>
    )
    return (
        <>
            <div id="appDashboard" className={dashboardStyle.dashboard}>
                <ComponentPageTransition isCurrentPage={currentPage === 'movies'}>
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
                    />
                </ComponentPageTransition>
                <ComponentPageTransition isCurrentPage={currentPage === 'tvShows'}>
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
                    />
                </ComponentPageTransition>
                <ComponentPageTransition isCurrentPage={currentPage === 'search'}>
                    <SearchForMedia
                        currentPage={currentPage}
                        isSpecificList={false}
                        refreshList={handleUpdatedList}
                        tvListNames={tvListNames}
                        movieListNames={movieListNames}
                    />
                </ComponentPageTransition>
                <ComponentPageTransition isCurrentPage={currentPage === 'settings'}>
                    <Settings
                        refreshList={handleUpdatedList}
                        tvListNames={tvListNames}
                        movieListNames={movieListNames}
                        listPref={listPref}
                        mediaPref={mediaPref}
                        defaultMediaPage={defaultMediaPage}
                        updateUser={updateUser}
                    />
                </ComponentPageTransition>
            </div>
            <div
                style={{height: "80px"}}
                className={currentPage === 'settings' ? dashboardStyle.compensateMobileBottom : undefined}/>
            <PageSelector
                currentPage={currentPage}
                handlePages={handlePages}
            />
        </>
    )
}

function PageSelector (props) {
    const {currentPage} = props;
    const [defaultHeight, setDefaultHeight] = useState(null);
    const [raiseComponent, setRaiseComponent] = useState(false);
    // function to raise component if safari/chrome mobile toolbars are hidden.
    useEffect(() => {
        if (defaultHeight === null) setDefaultHeight(window.innerHeight);
        const checkRaise = () => setRaiseComponent(window.innerHeight > defaultHeight);
        window.addEventListener('resize', checkRaise);
        return () => window.removeEventListener('resize', checkRaise);
    }, [defaultHeight])
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
            <div
                className={`${selectorStyle.raiseOnFullscreen} ${raiseComponent?selectorStyle.raise:""}`}
            />
        </div>
    )
}