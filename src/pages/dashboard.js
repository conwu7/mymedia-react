import React, { useCallback, useEffect, useState } from 'react';
import { BiCameraMovie } from 'react-icons/bi';
import { RiMovie2Line, RiMenu5Line, RiSearchLine } from 'react-icons/ri';

import ListTypesContainer from '../components/list-types-container';
import SearchForMedia from '../components/search';
import {CloseActivityButton, PopUpActivity} from '../components/common';
import Settings from './settings';

import dashboardStyle from '../stylesheets/pages/dashboard.module.scss';
import selectorStyle from '../stylesheets/components/list-types-selector.module.scss';

import {getCategories, fetchOrDeleteFromApi } from '../helpers/common';

export default function Dashboard (props) {
    const {user, updateUser, mediaPref, listPref} = props;
    // state for search popup
    const [useSearch, setSearchStatus] = useState(false);
    // state to block overflow and background details when there's a popup activity
    const [blockAppOverflow, setBlockAppOverflow] = useState(false);
    // state for storing all lists
    const [allLists, setAllLists] = useState({empty: true});
    // state to prevent extra get List fetches
    const [updatingLists, setUpdatingLists] = useState(false);
    // state for list names (no media details)
    const [movieListNames, setMovieListNames] = useState([]);
    const [tvListNames, setTvListNames] = useState([]);
    // state for settings popup
    const [showSettings, setShowSettings] = useState(false);
    // default to towatch aka Movies
    const [listCategory, setListCategory] = useState('towatch');
    const categories = getCategories();
    // Set document title to Movie or Tv Show after any change to list category
    useEffect(() => {
        if (!user) return
        document.title = `MyMedia - ${categories[listCategory]}`
    }, [listCategory, categories, user]);
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
    // get lists on initial render
    // different function to the getLists because I was unable to solve an
    // issue of this component re-rendering too many times and calling the
    // function multiple times on 1 render
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
    // function to change the listCategory state - used by list types selector
    const handleCategoryChange = (newCategory) => {
        if (newCategory === listCategory) return
        setListCategory(newCategory);
        document.title = ` - ${newCategory}`;
    }
    const handleOpenSearch = () => {
        setBlockAppOverflow(true);
        setSearchStatus(true);
    }
    const handleCloseSearch = () => {
        setBlockAppOverflow(false);
        setSearchStatus(false);
    }
    const handleOpenSettings = function (e) {
        setBlockAppOverflow(true);
        setShowSettings(true);
    }
    const handleCloseSettings = function () {
        setBlockAppOverflow(false);
        setShowSettings(false);
    }
    const handleUpdatedList = (listCategory) => {
        getLists(listCategory)
            .then(refreshListNames);
    }
    const mediaType = listCategory.includes('tv')?'tv':'movies';
    if (!user) return (
        <h1 className={dashboardStyle.noUserMessage}>
            Sign up or login to manage your media lists
        </h1>
    )
    return (
        <div>
            <div id="appDashboard" className={dashboardStyle.dashboard}>
                <ListTypesSelector
                    handleOpenSettings={handleOpenSettings}
                    handleOpenSearch={handleOpenSearch}
                    listCategory={listCategory}
                    handleCategoryChange={handleCategoryChange}
                    categories={categories}
                />
                <SearchForMedia
                    isSpecificList={false}
                    closeButton={<CloseActivityButton {...{handleActivityClose: handleCloseSearch}} />}
                    useActivity={useSearch}
                    refreshList={handleUpdatedList}
                    tvListNames={tvListNames}
                    movieListNames={movieListNames}
                    mediaType={mediaType}

                >
                </SearchForMedia>
                {
                    <PopUpActivity
                        useActivity={showSettings}
                        handleActivityClose={handleCloseSettings}
                    >
                        <Settings
                            refreshList={handleUpdatedList}
                            tvListNames={tvListNames}
                            movieListNames={movieListNames}
                            listPref={listPref}
                            mediaPref={mediaPref}
                            updateUser={updateUser}
                        />
                    </PopUpActivity>
                }
                <ListTypesContainer 
                    listCategory={listCategory}
                    categories={categories}
                    allLists={allLists}
                    listPref={listPref}
                    mediaPref={mediaPref}
                    getLists={getLists}
                    refreshList={handleUpdatedList}
                    setBlockAppOverflow={setBlockAppOverflow}
                />
                {/* <Footer /> */}
            </div>
            <div style={{height: "65px"}}/>
        </div>
    )
}

function ListTypesSelector (props) {
    const {listCategory, categories, handleOpenSettings, handleOpenSearch} = props;
    const handleTypeChange = (listCategory) => {
        return ( () => {props.handleCategoryChange(listCategory)} );
    }
    return (
        <div className={selectorStyle.selectorWrapper}>
            <div
                className={selectorStyle.selectorContainer}
            >
                {categories.map(category => (
                        <button
                            key={category.name}
                            onClick={handleTypeChange(category.name)}
                            id=''
                            className={listCategory === category.name ?
                                `${selectorStyle.activeCategory}` :
                                ''}
                        >
                            <div className={selectorStyle.imageContainer}>
                                {
                                    category.name === 'towatch' ?
                                        <BiCameraMovie />
                                        : <RiMovie2Line />
                                }
                            </div>
                            <div>{category.text}</div>
                        </button>
                    )
                )}
                <button
                    onClick={handleOpenSearch}
                >
                    <div className={selectorStyle.imageContainer}>
                        <RiSearchLine />
                    </div>
                    <div>Search</div>
                </button>
                <button
                    onClick={handleOpenSettings}
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