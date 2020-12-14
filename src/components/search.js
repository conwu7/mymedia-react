import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';

import {CenteredSearchBar} from '../components/common';

import style from '../stylesheets/components/search.module.scss';

export default function SearchForMovie (props) {
    const [searchString, setSearchString] = useState("");
    const [isSearching, setSearchingStatus] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [resultFocus, setResultFocus] = useState(false);
    const {specificList} = props;
    
    const handleSearch = async () => {
        setSearchResults(["Search for a movie to see results"+
        "Search for a movie to see results"+
        "Search for a movie to see results"+
        "Search for a movie to see results"+
        "Search for a movie to see results"+
        "Search for a movie to see results"+
        "Search for a movie to see results"+
        "Search for a movie to see results"+
        "Search for a movie to see results"+
        "Search for a movie to see results"+
        "Search for a movie to see results"+
        "Search for a movie to see results"+
        "Search for a movie to see results"+
        "Search for a movie to see results"+
        "Search for a movie to see results"+
        "Search for a movie to see results"+
        "Search for a movie to see results"+
        "Search for a movie to see results"+
        "Search for a movie to see results"+
        "Search for a movie to see results"+
        "Search for a movie to see results"+
        "Search for a movie to see results"+
        "Search for a movie to see results"+
        "Search for a movie to see results"+
        "Search for a movie to see results"+
        "Search for a movie to see results"+
        "Search for a movie to see results"+
        "Search for a movie to see results"+
        "Search for a movie to see results"+
        "Search for a movie to see results"+
        "Search for a movie to see results"+
        "Search for a movie to see results"+
        "Search for a movie to see results"+
        "Search for a movie to see results"])
        setResultFocus(!resultFocus);
        // if (isSearching) return
        // setSearchingStatus(true);
        // fetch(`/api/movies/search?searchString=${searchString}`)
        //     .then(response => response.json())
        //     .then(apiResponse => {
        //         setSearchResults(apiResponse.results);
        //         setSearchingStatus(false);
        //         if (resultsRef.current) resultsRef.current.focus();
        //     })
        //     .catch(err => console.log(err))
    }
    return (
        <div className={style.searchFormContainer}>
            <div className={style.closeButtonContainer}>{props.children}</div>
            <div className={style.searchAndResultsContainer}>
                <div className={style.searchForm}>
                    <SearchBar {...{searchString, setSearchString, handleSearch}}/>
                </div>
                <SearchResults {...{searchResults, resultFocus}}/>
            </div>
        </div>
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
function SearchResults (props) {
    const resultsRef = React.createRef();
    const {searchResults, resultFocus} = props;
    useEffect(() => {
        if (searchResults.length===0) return
        resultsRef.current.focus();
    }, [resultFocus, searchResults, resultsRef])
    return (
        <div className={style.searchResults} tabIndex="1" style={{outline: "none"}} ref={resultsRef}>
            {searchResults.length!==0? JSON.stringify(searchResults) : 
            "No results yet!"
            }
        </div>
    )
}
function SpecificListAction (props) {

}
function NonSpecificListAction (props) {

}