import React, { useCallback, useEffect, useState } from 'react';
import { BiCameraMovie } from 'react-icons/bi';
import { RiMovie2Line, RiMenu5Line, RiSearchLine } from 'react-icons/ri';

import MediaListsPage from '../components/media-lists-page';
import SearchForMedia from '../components/search';
import Settings from './settings';

import dashboardStyle from '../stylesheets/pages/dashboard.module.scss';
import selectorStyle from '../stylesheets/components/list-types-selector.module.scss';

import { fetchOrDeleteFromApi } from '../helpers/common';
import { animated, useSpring} from "react-spring";

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
    // function to handle blockAppOverflow state change
    useEffect(() => {
        const App = document.getElementsByTagName('body')[0];
        if (blockAppOverflow) { 
            App.style.overflow="hidden";
        } else {
            App.style.overflow="auto";
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
    // function to update list names
    const refreshListNames = useCallback(
        async function refreshListNames () {
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
    useEffect( () => {
        if (!user) return
        setUpdatingLists(true);
        async function initialGetLists () {
            const movieLists =
                await fetchOrDeleteFromApi(`lists/towatch`, 'get')
                    .catch(err => console.log(err))
            const tvLists =
                await fetchOrDeleteFromApi(`lists/towatchtv`, 'get')
                    .catch(err => console.log(err))
            setAllLists({towatch: movieLists, towatchtv: tvLists});
            setUpdatingLists(false);
        }
        initialGetLists()
            .catch(err => console.log(err));
    }, [user])
    const movieSpring = useSpring({
        to: {
            position: currentPage === 'movies' ? 'relative' : 'absolute',
            overflow: currentPage === 'movies' ? 'none' : 'hidden',
            top: currentPage === 'movies' ? 0: 0,
            opacity: currentPage === 'movies' ? 1 : 0,
            height: currentPage === 'movies' ? 'fit-content' : 0,
        }
    })
    const tvShowSpring = useSpring({
        to: {
            position: currentPage === 'tvShows' ? 'relative' : 'absolute',
            overflow: currentPage === 'tvShows' ? 'none' : 'hidden',
            top: currentPage === 'tvShows' ? 0: 0,
            opacity: currentPage === 'tvShows' ? 1 : 0,
            height: currentPage === 'tvShows' ? 'fit-content' : 0,
        }
    })
    const searchSpring = useSpring({
        to: {
            position: currentPage === 'search' ? 'relative' : 'absolute',
            overflow: currentPage === 'search' ? 'none' : 'hidden',
            top: currentPage === 'search' ? 0: 0,
            opacity: currentPage === 'search' ? 1 : 0,
            height: currentPage === 'search' ? 'fit-content' : 0,
        }
    })
    const settingsSpring = useSpring({
        to: {
            position: currentPage === 'settings' ? 'relative' : 'absolute',
            overflow: currentPage === 'settings' ? 'none' : 'hidden',
            top: currentPage === 'settings' ? 0: 0,
            opacity: currentPage === 'settings' ? 1 : 0,
            height: currentPage === 'settings' ? 'fit-content' : 0,
        }
    })
    // function to change the listCategory state - used by list types selector
    const handlePages = (newPage, title) => {
        if (newPage === currentPage) return
        setCurrentPage(newPage);
        document.title = `MyMediaLists - ${title}`;
    }
    const handleUpdatedList = (listCategory) => {
        getLists(listCategory)
            .then(refreshListNames);
    }
    if (!user) return (
        <h1 className={dashboardStyle.noUserMessage}>
            Sign up or login to manage your media lists
        </h1>
    )
    return (
        <>
            <div id="appDashboard" className={dashboardStyle.dashboard}>
                {
                    <animated.div
                        style={movieSpring}
                    >
                        <MediaListsPage
                        listCategory="towatch"
                        allLists={allLists.towatch}
                        listPref={listPref}
                        mediaPref={mediaPref}
                        getLists={getLists}
                        refreshList={handleUpdatedList}
                        setBlockAppOverflow={setBlockAppOverflow}
                        />
                    </animated.div>

                }
                {
                    <animated.div
                        style={tvShowSpring}
                    >
                        <MediaListsPage
                            listCategory="towatchtv"
                            allLists={allLists.towatchtv}
                            listPref={listPref}
                            mediaPref={mediaPref}
                            getLists={getLists}
                            refreshList={handleUpdatedList}
                            setBlockAppOverflow={setBlockAppOverflow}
                        />
                    </animated.div>
                }
                {
                    <animated.div
                        style={searchSpring}
                    >
                        <SearchForMedia
                            currentPage={currentPage}
                            isSpecificList={false}
                            refreshList={handleUpdatedList}
                            tvListNames={tvListNames}
                            movieListNames={movieListNames}
                        >
                        </SearchForMedia>
                    </animated.div>
                }
                {
                    <animated.div
                        style={settingsSpring}
                    >
                        <Settings
                            refreshList={handleUpdatedList}
                            tvListNames={tvListNames}
                            movieListNames={movieListNames}
                            listPref={listPref}
                            mediaPref={mediaPref}
                            updateUser={updateUser}
                        />
                    </animated.div>
                }
            </div>
            <div style={{height: "65px"}}/>
            <PageSelector
                currentPage={currentPage}
                handlePages={handlePages}
            />
        </>
    )
}

function PageSelector (props) {
    const {currentPage} = props;
    const handlePageChange = (newPage, title) => {
        return ( () => {props.handlePages(newPage, title)} );
    }
    return (
        <div className={selectorStyle.selectorWrapper}>
            <div className={selectorStyle.selectorContainer}>
                <button
                    onClick={handlePageChange('movies', 'Movies')}
                    className={currentPage === 'movies' ? selectorStyle.activeCategory : undefined}
                >
                    <div className={selectorStyle.imageContainer}>
                        <BiCameraMovie />
                    </div>
                    <div>Movies</div>
                </button>
                <button
                    onClick={handlePageChange('tvShows', 'Tv Shows')}
                    className={currentPage === 'tvShows' ? selectorStyle.activeCategory : undefined}
                >
                    <div className={selectorStyle.imageContainer}>
                        <RiMovie2Line />
                    </div>
                    <div>Tv Shows</div>
                </button>
                <button
                    onClick={handlePageChange('search', 'Search')}
                    className={currentPage === 'search' ? selectorStyle.activeCategory : undefined}
                >
                    <div className={selectorStyle.imageContainer}>
                        <RiSearchLine />
                    </div>
                    <div>Search</div>
                </button>
                <button
                    onClick={handlePageChange('settings', 'Menu')}
                    className={currentPage === 'settings' ? selectorStyle.activeCategory : undefined}
                    >
                    <div className={selectorStyle.imageContainer}>
                        <RiMenu5Line />
                    </div>
                    <div>Menu</div>
                </button>
            </div>
            <div className={selectorStyle.raiseOnFullscreen} />
        </div>
    )
}