import React, { useEffect, useState } from 'react';
import { Redirect, useHistory, useLocation } from 'react-router-dom';

import ListTypesContainer from '../components/list-types-container';
import SearchForMovie from '../components/search';
// import Footer from '../components/footer';
import { CloseActivityButton } from '../components/common';

import dashboardStyle from '../stylesheets/pages/dashboard.module.scss';
import selectorStyle from '../stylesheets/components/list-types-selector.module.scss';

import { getCategories, fetchFromApi } from '../helpers/common';

export default function Dashboard (props) {
    const [useSearch, setSearchStatus] = useState(false);
    const [blockAppOverflow, setAppOverflow] = useState(false);
    const [allLists, setAllLists] = useState({});
    // set ranked or pull in path list
    let defaultList = 'ranked';
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
    if (!paths[2] || !paths[3]) return (<Redirect to={`/dashboard/lists/${listCategory}`}/>);
    //
    const handleCategoryChange = (newCategory) => {
        if (newCategory === listCategory) return
        setListCategory(newCategory);
        history.push(`/dashboard/lists/${newCategory}`);
        document.title = ` - ${newCategory}`;
    }
    const handleActivityOpen = () => {
        setAppOverflow(true);
        setSearchStatus(true);
    }
    const handleActivityClose = () => {
        setAppOverflow(false);
        setSearchStatus(false);
    }
    const getLists = (listCategory) => {
        fetchFromApi(`lists/${listCategory}`)
        .then(lists => setAllLists({...allLists, [listCategory]: lists}))
        .catch(err => console.log(err))
    };
    const handleUpdatedList = (listCategory) => {
        getLists(listCategory);
    }
    if (!props.user) return (<h1>Sign up or login to use this website</h1>)
    return (
        <div>
            <div id="appDashboard" className={dashboardStyle.dashboard}>
                <ListTypesSelector {...{listCategory, handleCategoryChange, categories}}/>
                <div className={dashboardStyle.searchButtonContainer}>
                    <button 
                        className={dashboardStyle.searchButton}
                        onClick={handleActivityOpen}
                    >Search for a movie</button>
                </div>
                {
                    <SearchForMovie 
                        isSpecificList={false}
                        closeButton={<CloseActivityButton {...{handleActivityClose}} />}
                        useActivity={useSearch}
                        handleUpdatedList={handleUpdatedList}
                    >
                    </SearchForMovie>
                }
                <ListTypesContainer 
                    listCategory={listCategory}
                    categories={categories}
                    allLists={allLists}
                    getLists={getLists}
                    refreshList={handleUpdatedList}
                />
                {/* <Footer /> */}
            </div>
        </div>
    )
}

function ListTypesSelector (props) {
    const handleTypeChange = (listCategory) => {
        return ( () => {props.handleCategoryChange(listCategory)} );
    }
    return (
        <div className={selectorStyle.selectorContainer}>
            {props.categories.map(category => (
                    <button 
                        key={category.name}
                        onClick={handleTypeChange(category.name)}
                        id=''
                        className={props.listCategory===category.name?
                            `${selectorStyle.activeCategory}`:
                            ''}
                    >{category.text}</button>
            )
            )}
        </div>
    )
    
}