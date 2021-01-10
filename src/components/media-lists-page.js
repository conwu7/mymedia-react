import React, { useState } from 'react';

import { CollapsibleCard, PopUpActivity } from './common';
import EditUserMedia from "./edit-user-media";
import { HiDotsHorizontal } from 'react-icons/hi';
import { CgArrowsExpandUpLeft } from 'react-icons/cg';

import listContainerStyle from '../stylesheets/components/list-container.module.scss';
import userMovieStyle from '../stylesheets/components/user-movie.module.scss';

import defaultPoster from '../images/default-poster.png';
import {fetchOrDeleteFromApi, putOrPostToApi, sortLists} from '../helpers/common';
import WaitForServer from "./wait-for-server";
import { AddToList } from "./search";

export default function MediaListsPage (props) {
    const {allLists, refreshList, listPref, mediaPref,
            listCategory, tvListNames, movieListNames,
                completedList, updateCompletedList} = props;
    return (
        <div className={listContainerStyle.mediaListPage}>
            <div className={listContainerStyle.allListsContainer}>
                {
                    allLists && allLists.length === 0 ?
                        <div className={listContainerStyle.emptyLists}>
                            <p>Your {listCategory === 'towatch' ? 'movies' : 'tv shows'} list is empty</p>
                            <p>To create new lists, click on "Menu" on the bottom tab</p>
                            <p>then click "Create New List"</p>
                        </div>
                        : undefined
                }
                {allLists &&
                sortLists(allLists, listPref, mediaPref).map((list, index) => (
                    <ListContainer
                        key={list.name}
                        list={list}
                        listCategory={listCategory}
                        refreshList={refreshList}
                        expandByDefault={index===0}
                        tvListNames={tvListNames}
                        movieListNames={movieListNames}
                        updateCompletedLists={updateCompletedList}
                    />
                ))}

                <div className={listContainerStyle.completedListContainer}>
                    {
                        (completedList && completedList.length!==0 &&
                            completedList.mediaInstants && completedList.mediaInstants.length !== 0) &&
                        <ListContainer
                            list={sortLists([completedList], listPref, mediaPref)[0]}
                            listCategory={listCategory}
                            refreshList={refreshList}
                            expandByDefault={false}
                            tvListNames={tvListNames}
                            movieListNames={movieListNames}
                            useCompleted={true}
                            updateCompletedLists={updateCompletedList}
                        />
                    }
                </div>

            </div>
        </div>
    )
}
function ListContainer (props) {
    const {list, listCategory, refreshList, expandByDefault, useCompleted,
            movieListNames, tvListNames, updateCompletedLists} = props;
    return (
        <div className={listContainerStyle.listContainer}>
                <CollapsibleCard 
                    cardHeader={<ListDetails list={list}/>} 
                    skipStyleHeader={true}
                    buttonSize="largeBtn"
                    isCollapsed={!expandByDefault}
                    disableHeaderButton={false}
                >
                    {
                        !list.mediaInstants || list.mediaInstants.length === 0 ?
                            <div className={listContainerStyle.emptyLists}>
                                <p>This list is empty</p>
                                <p>To add a {listCategory === 'towatch' ? 'movie' : 'tv show'},</p>
                                <p>Search for one then click "add to list" on a result</p>
                            </div>
                            : undefined
                    }
                    <AllUserMediaContainer
                        mediaInstants={list.mediaInstants}
                        listCategory={listCategory}
                        list={list}
                        refreshList={refreshList}
                        tvListNames={tvListNames}
                        movieListNames={movieListNames}
                        updateCompletedLists={updateCompletedLists}
                        useCompleted={useCompleted}
                        />
                </CollapsibleCard>
        </div>
    )
}
function ListDetails (props) {
    const {list} = props;
    return (
        <div className={listContainerStyle.listDetails}>
            <h1 className={listContainerStyle.listName}>{list.name.toLocaleUpperCase()}</h1>
            <h2 className={listContainerStyle.listDescription}>{list.description}</h2>
        </div>
    )
}
function AllUserMediaContainer (props) {
    const {mediaInstants, listCategory, list, refreshList, useCompleted,
            tvListNames, movieListNames, updateCompletedLists} = props;
    return (
        <div className={listContainerStyle.allUserMoviesContainer}>
            {mediaInstants.map(instant => (
                <UserMediaCard
                    key={instant._id}
                    userMedia={instant.userMedia}
                    listCategory={listCategory}
                    list={list}
                    refreshList={refreshList}
                    tvListNames={tvListNames}
                    movieListNames={movieListNames}
                    updateCompletedLists={updateCompletedLists}
                    useCompleted={useCompleted}
                />
                )
            )}
        </div>
    )
}
function UserMediaCard (props) {
    const [showMoreInfo, setShowMoreInfo] = useState(false);
    const {listCategory, list, userMedia, refreshList, useCompleted,
            tvListNames, movieListNames, updateCompletedLists} = props;
    const { streamingSource, media} = userMedia;
    const {title, posterUrl, releaseDate} = media;
    const handleOpenShowMoreInfo = () => {
        setShowMoreInfo(true);
    };
    const handleCloseShowMoreInfo = () => {
        setShowMoreInfo(false);
    };
    return (
    <div className={userMovieStyle.userMovie}>
        <MovieActionsMenuContainer
            userMedia={userMedia}
            refreshList={refreshList}
            tvListNames={tvListNames}
            movieListNames={movieListNames}
            listCategory={listCategory}
            list={list}
            useCompleted={useCompleted}
            updateCompletedLists={updateCompletedLists}
        />
        <div className={userMovieStyle.menuSpace}>Hello There</div>
        <div className={userMovieStyle.movieDetails}>
            <div className={userMovieStyle.posterContainer}>
                <img 
                    src={posterUrl || defaultPoster}
                    alt={title+" poster"}
                    className={userMovieStyle.poster}
                    />
            </div>
            <h1 className={userMovieStyle.movieTitle}>{title}</h1>
            <p className={userMovieStyle.streamingSource}>
                {streamingSource && streamingSource.toUpperCase()}
            </p>
            <p className={userMovieStyle.releaseDate}><span>{releaseDate}</span></p>
            <button
                className={userMovieStyle.moreInfoButton}
                onClick={handleOpenShowMoreInfo}
            >
                More Info
            </button>
            <PopUpActivity
                useActivity={showMoreInfo}
                handleActivityClose={handleCloseShowMoreInfo}
            >
                <MoreInfoCard
                    media={media}
                    userMedia={userMedia}
                />
            </PopUpActivity>
        </div>
    </div>
    )
}
function MoreInfoCard (props) {
    const {media, userMedia} = props;
    const {title, genre, runtime, releaseDate, posterUrl, plot, imdbRating, actors,
            runYears, totalSeasons} = media;
    const {isWatched, toWatchNotes, reviewNotes, userRating, imdbID} = userMedia;

    return (
        <div className={userMovieStyle.moreInfoContainer}>
            <section className={userMovieStyle.posterAndMainInfoContainer}>
                <div className={userMovieStyle.posterInMoreContainer}>
                    <img
                        src={posterUrl || defaultPoster}
                        alt={`${title} poster`}
                        className={userMovieStyle.posterInMore}
                    />
                </div>
                <div className={userMovieStyle.mainInfoContainer}>
                    <h1 className={userMovieStyle.movieTitle}>{title}</h1>
                    <p className={userMovieStyle.runtime}>({runtime?runtime:'-'} min)</p>
                    <p className={userMovieStyle.genre}>{genre && genre.join(', ')}</p>
                    <p className={userMovieStyle.releaseDate}>
                        {
                            (runYears && totalSeasons) ?
                            `${runYears} (${totalSeasons} season${totalSeasons>1?'s':""})` :
                            releaseDate
                        }
                    </p>
                    <p className={userMovieStyle.imdbRating}>
                        <a href={`https://imdb.com/title/${imdbID}`} target="_blank" rel="noopener noreferrer">IMDB</a>
                        <span className={userMovieStyle.imdbRatingSpan}>{imdbRating || "-"}</span>/10
                    </p>
                </div>
            </section>
            <section className={userMovieStyle.otherInfoContainer}>
                <CollapsibleCard
                    cardHeader="Cast"
                    isCollapsed={false}
                    hideButton={false}
                    collapseButton={<CgArrowsExpandUpLeft />}
                >
                    <p className={userMovieStyle.actors}>{actors && actors.join(', ')}</p>
                </CollapsibleCard>
                <CollapsibleCard
                    cardHeader="Your Watch Notes"
                    isCollapsed={false}
                    hideButton={false}
                    collapseButton={<CgArrowsExpandUpLeft />}
                >
                    <p className={userMovieStyle.toWatchNotes}>{toWatchNotes || "-"}</p>
                </CollapsibleCard>
                <CollapsibleCard
                    cardHeader="Plot"
                    isCollapsed={false}
                    hideButton={false}
                    collapseButton={<CgArrowsExpandUpLeft />}
                >
                    <p className={userMovieStyle.plot}>{plot || "-"}</p>
                </CollapsibleCard>
                {
                    isWatched &&
                    (
                        <CollapsibleCard
                            cardHeader="Your Review"
                            isCollapsed={false}
                            hideButton={false}
                            collapseButton={<CgArrowsExpandUpLeft />}
                        >
                            <UserNotesAndRating
                                userRating={userRating}
                                reviewNotes={reviewNotes}
                            />
                        </CollapsibleCard>
                    )
                }
            </section>
        </div>
    )
}
function MovieActionsMenuContainer (props) {
    const [wait, setWaitForServer] = useState(false);
    // state for adding media to another list
    const [openAddToOtherList, setOpenAddToOtherList] = useState(false);
    const {userMedia, refreshList, tvListNames, movieListNames, useCompleted,
            listCategory, list, updateCompletedLists} = props;
    const {imdbID, _id} = userMedia;
    const {toWatchListsTv} = tvListNames;
    const {toWatchLists} = movieListNames;
    // state for editing user media popup
    const [editingUserMedia, setEditingUserMedia] = useState(false);
    const handleOpenEditMedia = () => {
        setEditingUserMedia(true);
    }
    const handleCloseEditMedia = () => {
        setEditingUserMedia(false);
    }
    const handleOpenAddToOtherList = () => {
        setOpenAddToOtherList(true);
    }
    const handleCloseAddToOtherList = () => {
        setOpenAddToOtherList(false);
    }
    const handleRemoveFromList = () => {
        setWaitForServer(true);
        fetchOrDeleteFromApi(`lists/${listCategory}/${list._id}/${imdbID}`, 'delete')
            .then(()=>refreshList(listCategory))
            .catch(err => window.alert(err))
            .finally(() => {setWaitForServer(false)});
    };
    const handleMarkComplete = async () => {
        setWaitForServer(true);
        try {
            await putOrPostToApi(
                {listID: list._id, userMediaID: _id},
                `lists/${listCategory}/${imdbID}/completed`,
                'post'
            )
            updateCompletedLists();
            refreshList(listCategory);
        } catch (err) {
            window.alert(err);
        } finally {
            setWaitForServer(false);
        }
    }
    const handleMarkInComplete = async () => {
        setWaitForServer(true);
        fetchOrDeleteFromApi(`lists/${listCategory}/${imdbID}/completed`, 'delete')
            .then(() => updateCompletedLists())
            .catch(err => window.alert(err))
            .finally(() => {setWaitForServer(false)});
    }
    return (
        <>
            <WaitForServer
                wait={wait}
                waitText={"Removing movie from list"}
            />
            <div className={userMovieStyle.menuContainer}>
                <CollapsibleCard
                    collapseButton={<HiDotsHorizontal className={userMovieStyle.menuButton}/>}
                    skipAllStyling={true}
                    isCollapsed={true}
                    hideOnFocusLost={true}
                >
                    <div className={userMovieStyle.buttonContainer}>
                        <button onClick={handleOpenEditMedia}>Edit</button>
                        <button onClick={handleOpenAddToOtherList}>Add to List</button>
                        {
                            !useCompleted &&
                            <button
                                className={userMovieStyle.markComplete}
                                onClick={handleMarkComplete}
                            >
                                Completed?
                            </button>
                        }
                        <button
                            className={userMovieStyle.remove}
                            onClick={useCompleted ? handleMarkInComplete : handleRemoveFromList}
                        >
                            Remove
                        </button>
                    </div>
                </CollapsibleCard>
            </div>
            <PopUpActivity
                useActivity={openAddToOtherList}
                handleActivityClose={handleCloseAddToOtherList}
            >
                <AddToList
                    imdbID={userMedia.imdbID}
                    refreshList={refreshList}
                    handleActivityClose={handleCloseAddToOtherList}
                    toWatchListsTv={toWatchListsTv}
                    toWatchLists={toWatchLists}
                    showMovies={listCategory === 'towatch'}
                    showTv={listCategory === 'towatchtv'}
                    streamingSource={userMedia.streamingSource}
                />
            </PopUpActivity>
            <PopUpActivity
                useActivity={editingUserMedia}
                handleActivityClose={handleCloseEditMedia}
            >
                <EditUserMedia
                    userMedia={userMedia}
                    listCategory={listCategory}
                    refreshList={refreshList}
                    handleActivityClose={handleCloseEditMedia}
                />
            </PopUpActivity>
        </>
    )
}
function UserNotesAndRating (props) {
    return (
        <div>
            <p>
                <span className={userMovieStyle.userRating}>{props.userRating===0?"-":props.userRating}</span>/10
            </p>
            <p className={userMovieStyle.reviewNotes}>{props.reviewNotes || "-"}</p>
        </div>
    )
}

