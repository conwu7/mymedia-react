import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';

import { CenteredSearchBar,PopUpActivity, CloseActivityButton, CollapsibleCard } from '../components/common';

import style from '../stylesheets/components/search.module.scss';

import { fetchFromApi, postToApi } from '../helpers/common';

import { AiOutlineLoading } from 'react-icons/ai';
import defaultPoster from '../images/default-poster.png';

export default function SearchForMovie (props) {
    const [searchString, setSearchString] = useState("");
    const [isSearching, setSearchingStatus] = useState(false);
    const [isSearchComplete, setSearchComplete] = useState(false);
    const [searchError, setSearchError] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [listNames, setListNames] = useState({});
    const {isSpecificList, closeButton, useActivity, handleUpdatedList} = props;
    useEffect(() => {
        fetchFromApi('lists/getalllistnames')
            .then(result => setListNames(result))
            .catch(err => console.log(err))
    }, [])
    const handleSearch = async () => {
        if (isSearching) return
        setSearchingStatus(true);
        setTimeout(() => {
            document.querySelector(".takeFocus").focus();
        }, 100);
        try {
            const searchResults = await fetchFromApi(`movies/search?searchString=${searchString}`);
            setSearchResults(searchResults);
        } catch (err) {
            setSearchResults([]);
            setSearchError(err);
        }
        setSearchComplete(true);
        setSearchingStatus(false);
        
    }
    return (
        <PopUpActivity
            closeButton={closeButton}
            useActivity={useActivity}
        >
            <div tabIndex="2" className="takeFocus"></div>
            <div className={style.searchFormContainer}> 
                <div className={style.searchForm}>
                    <SearchBar {...{searchString, setSearchString, handleSearch}}/>
                </div>
                <SearchResultsContainer 
                    isSearching={isSearching}
                    isSearchComplete={isSearchComplete}
                    searchError={searchError}
                    listNames={listNames}
                    searchResults={searchResults}
                    isSpecificList={isSpecificList}
                    handleUpdatedList={handleUpdatedList}
                />
            </div>
        </PopUpActivity>
    )
}
function SearchBar (props) {
    const {searchString, setSearchString, handleSearch} = props;
    const formik = useFormik({
        initialValues: {
            searchString
        },
        onSubmit: values => {
            handleSearch();
        },
        validate: (values, props) => {
            setSearchString(values.searchString);
        }
    });
    return (
        <CenteredSearchBar 
            inputName="searchString"
            type="text"
            onChange={formik.handleChange}
            value={formik.values.searchString}
            onSubmit={formik.handleSubmit}
            showSearchButton={true}
        />
    )
}
function SearchResultsContainer (props) {
    const resultsRef = React.createRef();
    const {searchResults, isSpecificList, handleUpdatedList,
        isSearchComplete, isSearching, listNames} = props;
    let searchError = props.searchError || "No Result";
    return (
        <div className={style.searchResultsContainer} tabIndex="1" style={{outline: "none"}} ref={resultsRef}>
            {isSearching?
                <div className={style.loading}><AiOutlineLoading /></div>
                : !isSearchComplete? 
                "Press Enter or click Search!"
                : searchResults.length===0? 
                searchError
                : searchResults.map(movie => (
                    <ResultCardOMDB 
                        key={movie.id} 
                        movie={movie}
                        isSpecificList={isSpecificList}
                        listNames={listNames}
                        handleUpdatedList={handleUpdatedList}
                        />
                    ))
            }
        </div>
    )
}
function ResultCardOMDB (props) { //using OMDB api properties
    const {movie, isSpecificList, list, listNames, handleUpdatedList} = props;
    return (
        <div className={style.resultCard}>
            <div className={style.posterContainer}>
                {movie.i?
                <div><img src={movie.i.imageUrl} alt="movie poster"/></div>
                : <img src={movie.posterUrl || defaultPoster} alt={movie.title+" poster"} />
                }
            </div>
            <div className={style.movieInfoContainer}>
                <h1 className={style.movieTitle}>{movie.l}</h1>
                <p className={style.actors}>{movie.s}</p>
                <p className={style.releaseDate}>{movie.y}</p>
            </div>
            <div className={style.actionContainer}>
                {isSpecificList?
                    <SpecificListAction 
                        imdbID={movie.id} 
                        list={list}
                        /> 
                    : <NonSpecificListAction 
                        imdbID={movie.id} 
                        listNames={listNames}
                        handleUpdatedList={handleUpdatedList}
                        />
                }
            </div>
        </div>
    )
}
function SpecificListAction (props) {
    return null
}
function NonSpecificListAction (props) {
    const {listNames, imdbID, handleUpdatedList} = props;
    const [useActionActivity, setActionActivityStatus] = useState(false);
    const formik = useFormik({
        initialValues: {
            toWatchNotes: ""
        },
        onSubmit: values => {return}
    })
    // Too many server/db calls
    // useEffect(() => {
    //     fetchFromApi(`usermovies/${imdbID}`)
    //         .then(userMovie => {
    //             formik.values.toWatchNotes = userMovie.toWatchNotes;
    //         })
    //         .catch(err => null);
    // }, [imdbID]);
    const handleAddToList = (listCategory, listName) => {
        return async (e) => {
            const response = await postToApi(
                formik.values, 
                `/api/lists/${listCategory}/${listName}/${imdbID}`);
            if (response.success) {
                window.alert("Movie added to list");
                handleUpdatedList(listCategory);
                handleActivityClose();
            }
            if (!response.success) window.alert("Unable to add movie to list. "+response.err);
        }
    }
    const handleActivityOpen = () => {
        setActionActivityStatus(true);
    }
    const handleActivityClose = () => {
        setActionActivityStatus(false);
    }
    
    return (
        <div className={style.nonSpecificAction}>
            <button onClick={handleActivityOpen}>Add to a list</button>
            {
                <PopUpActivity 
                    useActivity={useActionActivity}
                    closeButton={<CloseActivityButton className={style.actionButton} {...{handleActivityClose}}/>}
                    >
                    <div className={style.allListsContainer}>
                        <div className={style.addToWatchNotes}>
                            <CollapsibleCard 
                                isCollapsed={true} 
                                cardHeader={
                                    <div className={style.userNotesLabel}>
                                        <label htmlFor="toWatchNotes">Expand to add Watch Notes,</label>
                                        <p>then select a list</p>
                                    </div>
                                }
                                skipStyleHeader={true}
                            >
                                <textarea
                                id="toWatchNotes"
                                name="toWatchNotes"
                                type="text"
                                onChange={formik.handleChange}
                                onSubmit={formik.handleSubmit}
                                value={formik.values.toWatchNotes}
                            />
                            </CollapsibleCard>
                        </div>
                        <ul>
                            To Watch
                            {listNames.toWatchLists.length===0?
                            <p>-</p>
                            :listNames.toWatchLists.map(list => (
                                <li key={list._id}>
                                    <button onClick={handleAddToList('towatch', list.name)}>
                                    {list.name}
                                    </button>
                                </li>
                            ))}
                            <br />
                            Others
                            {listNames.otherLists.length===0?
                            <p>-</p>
                            :listNames.otherLists.map(list => (
                                <li key={list._id}>
                                    <button onClick={handleAddToList('other', list.name)}>
                                        {list.name}
                                    </button>
                                </li>
                            ))}
                            <br />
                            Ranked
                            {listNames.rankedLists.length===0?
                            <p>-</p>
                            :listNames.rankedLists.map(list => (
                                <li key={list._id}>
                                    <button onClick={handleAddToList('ranked', list.name)}>
                                    {list.name}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
            </PopUpActivity>
            }
        </div>
    )
}