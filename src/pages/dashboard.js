import React, {useCallback, useEffect, useState} from 'react';
import { Redirect, useHistory, useLocation } from 'react-router-dom';
import { BiCameraMovie } from 'react-icons/bi';
import { RiMovie2Line, RiSettings3Line } from 'react-icons/ri';

import ListTypesContainer from '../components/list-types-container';
import SearchForMedia from '../components/search';
import {CloseActivityButton, PopUpActivity} from '../components/common';
import Settings from './settings';

import dashboardStyle from '../stylesheets/pages/dashboard.module.scss';
import selectorStyle from '../stylesheets/components/list-types-selector.module.scss';

import {getCategories, fetchOrDeleteFromApi } from '../helpers/common';


export default function Dashboard (props) {
    const {user} = props;
    const [useSearch, setSearchStatus] = useState(false);
    const [blockAppOverflow, setBlockAppOverflow] = useState(false);
    const [allLists, setAllLists] = useState({});
    const [updatingLists, setUpdatingLists] = useState(false);
    const [movieListNames, setMovieListNames] = useState([]);
    const [tvListNames, setTvListNames] = useState([]);
    const [showSettings, setShowSettings] = useState(false);
    // set ranked or pull in path list
    let defaultList = 'towatch';
    const categories = getCategories();
    const location = useLocation();
    const history = useHistory();
    const paths = location.pathname.split('/')
    if (paths[1]==='dashboard'&&paths[2]==='lists'&&paths.length===4) {
        defaultList = paths[3];
    }
    const [listCategory, setListCategory] = useState(defaultList);
    useEffect(() => {
        document.title = `MyMedia - ${categories[listCategory]}`
    }, [listCategory, categories]);
    useEffect(() => {
        if (!useSearch) {
            document.getElementById("App").focus();
        };
    }, [useSearch]);
    useEffect(() => {
        const App = document.getElementsByTagName('body')[0];
        if (blockAppOverflow) { 
            App.style.overflow="hidden";
        } else {
            App.style.overflow="auto";
        }
    }, [blockAppOverflow])
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
    useEffect(() => {
        refreshListNames()
            .catch(err => console.log(err));
    }, [refreshListNames]);
    if (!paths[2] || !paths[3]) return (<Redirect to={`/dashboard/lists/${listCategory}`}/>);
    //
    const handleCategoryChange = (newCategory) => {
        if (newCategory === listCategory) return
        setListCategory(newCategory);
        history.push(`/dashboard/lists/${newCategory}`);
        document.title = ` - ${newCategory}`;
    }
    const handleActivityOpen = () => {
        setBlockAppOverflow(true);
        setSearchStatus(true);
    }
    const handleActivityClose = () => {
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
    const getLists = (listCategory) => {
        if (updatingLists) return
        setUpdatingLists(true);
        return fetchOrDeleteFromApi(`lists/${listCategory}`, 'get')
        .then(lists => setAllLists({...allLists, [listCategory]: lists}))
        .catch(err => console.log(err))
        .finally(() => {setUpdatingLists(false)});
    };
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
                    listCategory={listCategory}
                    handleCategoryChange={handleCategoryChange}
                    categories={categories}
                />
                <div className={dashboardStyle.searchButtonContainer}>
                    <button 
                        className={dashboardStyle.searchButton}
                        onClick={handleActivityOpen}
                    >Search for a {mediaType==='tv'?'Tv Show':'Movie'}</button>
                </div>
                {
                    <SearchForMedia
                        isSpecificList={false}
                        closeButton={<CloseActivityButton {...{handleActivityClose}} />}
                        useActivity={useSearch}
                        refreshList={handleUpdatedList}
                        tvListNames={tvListNames}
                        movieListNames={movieListNames}
                        mediaType={mediaType}

                    >
                    </SearchForMedia>
                }
                {
                    <PopUpActivity
                        useActivity={showSettings}
                        handleActivityClose={handleCloseSettings}
                    >
                        <Settings
                            refreshList={handleUpdatedList}
                            tvListNames={tvListNames}
                            movieListNames={movieListNames}
                        />
                    </PopUpActivity>
                }
                <ListTypesContainer 
                    listCategory={listCategory}
                    categories={categories}
                    allLists={allLists}
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
    const {listCategory, categories, handleOpenSettings} = props;
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
                    onClick={handleOpenSettings}
                    >
                    <div className={selectorStyle.imageContainer}>
                        <RiSettings3Line />
                    </div>
                    <div>Settings</div>
                </button>
            </div>
            <div className={selectorStyle.raiseOnFullscreen}></div>
        </div>
    )
}