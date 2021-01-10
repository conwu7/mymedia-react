import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';

import {CenteredSearchBar, PopUpActivity, StreamingSourceFieldset} from './common';
import ListSelector from "./list-selector";
import style from '../stylesheets/components/search.module.scss';

import { fetchOrDeleteFromApi, putOrPostToApi } from '../helpers/common';
import { SearchSchema, StreamingSchema } from "../helpers/validation";

import { AiOutlineLoading } from 'react-icons/ai';
import { MdAddCircleOutline } from 'react-icons/md';
import defaultPoster from '../images/default-poster.png';
import WaitForServer from "./wait-for-server";

export default function SearchForMedia (props) {
    const [searchString, setSearchString] = useState("");
    const [isSearching, setSearchingStatus] = useState(false);
    const [isSearchComplete, setSearchComplete] = useState(false);
    const [previousSearch, setPreviousSearch] = useState("");
    const [searchError, setSearchError] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const {isSpecificList, refreshList, movieListNames, tvListNames, currentPage} = props;
    let focusTimeout = "";
    useEffect(() => {
        return (() => {clearTimeout(focusTimeout)})
    }, [focusTimeout]);
    const handleSearch = async () => {
        if (isSearching) return
        if (searchString === previousSearch) return
        setPreviousSearch(searchString);
        setSearchingStatus(true);
        focusTimeout = setTimeout(() => {
            document.querySelector(".takeFocus").focus();
        }, 100);
        try {
            const searchResults = await fetchOrDeleteFromApi(`movies/search?searchString=${searchString}`, 'get');
            setSearchResults(searchResults);
        } catch (err) {
            setSearchResults([]);
            setSearchError(err);
        }
        setSearchComplete(true);
        setSearchingStatus(false);
        
    }
    return (
        <>
            <div tabIndex="2" className="takeFocus" style={{height: 0, overflow: "hidden"}}>Hello there !</div>
            <div className={style.searchFormContainer}> 
                <div>
                    <SearchBar
                        searchString={searchString}
                        setSearchString={setSearchString}
                        handleSearch={handleSearch}
                        disabled={currentPage !== 'search'}
                    />
                </div>
                <SearchResultsContainer 
                    isSearching={isSearching}
                    isSearchComplete={isSearchComplete}
                    searchError={searchError}
                    tvListNames={tvListNames}
                    movieListNames={movieListNames}
                    searchResults={searchResults}
                    isSpecificList={isSpecificList}
                    refreshList={refreshList}
                />
            </div>
        </>
    )
}
function SearchBar (props) {
    const {searchString, setSearchString, handleSearch, disabled} = props;
    const formik = useFormik({
        initialValues: {
            searchString
        },
        validationSchema: SearchSchema,
        validate: (values) => setSearchString(values.searchString),
        onSubmit: () => handleSearch(),
    });
    return (
        <React.Fragment>
            <CenteredSearchBar
            inputName="searchString"
            type="text"
            onChange={formik.handleChange}
            blur={formik.handleBlur}
            value={formik.values.searchString}
            onSubmit={formik.handleSubmit}
            showSearchButton={true}
            disabled={disabled}
            />
            <div className="errorDiv">
                {formik.touched.searchString && formik.errors.searchString}
            </div>
        </React.Fragment>
    )
}
function SearchResultsContainer (props) {
    const resultsRef = React.createRef();
    const {
        searchResults, isSpecificList, refreshList,
        isSearchComplete, isSearching, movieListNames, tvListNames
    } = props;
    let searchError = props.searchError || "No Result";
    return (
        <div
            tabIndex="1"
            style={{outline: "none"}}
            ref={resultsRef}
        >
            {isSearching ?
                <div className={style.loading}><AiOutlineLoading/></div>
                : !isSearchComplete ?
                    <p className={style.notSearchedYet}>Press Enter or click Search!</p>
                    : searchResults.length === 0 ?
                        <p className={style.notSearchedYet}>{searchError}</p>
                        : searchResults.map(media => (
                            <ResultCardOMDB
                                key={media.id}
                                media={media}
                                isSpecificList={isSpecificList}
                                tvListNames={tvListNames}
                                movieListNames={movieListNames}
                                refreshList={refreshList}
                            />
                        ))
            }
        </div>
    )
}
function ResultCardOMDB (props) { //using OMDB api properties
    const {media, isSpecificList, list, refreshList,
            tvListNames, movieListNames} = props;
    const mediaTypeResult = media.q === 'TV series' || media.q === 'TV mini-series'?
                            'tv':'movies';
    const {posterUrl, title, i} = media;
    const {imageUrl} = typeof i === "undefined" ? {} : i;
    return (
        <div className={style.resultCard}>
            <div className={style.posterContainer}>
                {typeof i !== 'undefined'?
                <div><img src={imageUrl} alt="movie poster"/></div>
                : <img src={posterUrl || defaultPoster} alt={title+" poster"} />
                }
            </div>
            <div className={style.movieInfoContainer}>
                <h1 className={style.movieTitle}>{media.l}</h1>
                <p className={style.mediaType}>
                    {
                        media.q==='feature'?
                        'Movie'
                        : (media.q==='TV series' || media.q==='TV mini-series')?
                        'Tv Show'
                        : 'Other'
                    }
                </p>
                <p className={style.actors}>{media.s}</p>
                <p className={style.releaseDate}>{media.y}</p>

            </div>
            <div className={style.actionContainer}>
                {isSpecificList?
                    <SpecificListAction 
                        imdbID={media.id}
                        list={list}
                        /> 
                    : <NonSpecificListAction 
                        imdbID={media.id}
                        tvListNames={tvListNames}
                        movieListNames={movieListNames}
                        refreshList={refreshList}
                        mediaType={mediaTypeResult}
                        />
                }
            </div>
        </div>
    )
}
function SpecificListAction () {
    return null
}
function NonSpecificListAction (props) {
    const {imdbID, refreshList, mediaType,
            tvListNames, movieListNames} = props;
    const {toWatchListsTv} = tvListNames;
    const {toWatchLists} = movieListNames;
    const [addToListPopUp, setAddToListPopUp] = useState(false);
    const handleActivityOpen = () => {
        setAddToListPopUp(true);
    }
    const handleActivityClose = () => {
        setAddToListPopUp(false);
    }

    return (
        <div className={style.nonSpecificAction}>
            <button
                onClick={handleActivityOpen}
                className={style.addToListButton}
            >
                <span className={style.addToListSpan}>Add to</span>
                <span className={style.addToListSpan}>a list</span>
            </button>
            <PopUpActivity
                useActivity={addToListPopUp}
                handleActivityClose={handleActivityClose}
            >
               <AddToList
                    imdbID={imdbID}
                    refreshList={refreshList}
                    handleActivityClose={handleActivityClose}
                    showTv={mediaType === 'tv'}
                    showMovies={mediaType === 'movies'}
                    toWatchListsTv={toWatchListsTv}
                    toWatchLists={toWatchLists}
               />
            </PopUpActivity>

        </div>
    )
}
export function AddToList (props) {
    const {imdbID, refreshList, handleActivityClose, toWatchLists, toWatchListsTv,
            showTv, showMovies, streamingSource} = props;
    const formik = useFormik({
        initialValues: {
            streamingSource: streamingSource || "selectOne"
        },
        onSubmit: () => {},
        validate: (values) => (
            (values.streamingSource === "selectOne") ? {streamingSource: 'Required'} : undefined
        ),
        validationSchema: StreamingSchema,
    });
    const [wait, setWaitForServer] = useState(false);
    const handleAddToList = async (listCategory, listID) => {
        const {streamingSource} = formik.values;
        if (streamingSource === 'selectOne') return
        setWaitForServer(true);
        try {
            await putOrPostToApi(
                formik.values,
                `lists/${listCategory}/${listID}/${imdbID}`,
                'post');
            refreshList(listCategory);
            handleActivityClose();
        } catch (err) {
            if (err === 'not-found') refreshList(listCategory);
            window.alert(`Unsuccessful -  ${err}`);
        } finally {
            setWaitForServer(false);
        }
    }
    const handleSelection = (list, listCategory) => {
        handleAddToList(listCategory, list._id)
            .catch(err => console.log(err));
    };
    return (
        <div className={style.allListsContainer}>
            <WaitForServer
                wait={wait}
                waitText="Saving to your list"
            />
            <div>
                <div>
                    <StreamingSourceFieldset
                        fieldsetClass={style.streamingSource}
                        formik={formik}
                    />
                </div>
                <div className="errorDiv">
                    {
                        formik.values.streamingSource === 'selectOne' &&
                        'Required'
                    }
                </div>
            </div>
            <ListSelector
                showTv={showTv}
                showMovies={showMovies}
                actionIcon={<MdAddCircleOutline/>}
                handleSelection={handleSelection}
                tvListNames={toWatchListsTv}
                movieListNames={toWatchLists}
            />
        </div>
    )
}