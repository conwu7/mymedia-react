import React, { useState } from 'react';

import { CollapsibleCard, PopUpActivity } from './common';
import EditUserMedia from "./edit-user-media";
import { HiDotsHorizontal } from 'react-icons/hi';
import { CgArrowsExpandUpLeft } from 'react-icons/cg';

import listContainerStyle from '../stylesheets/components/list-container.module.scss';
import userMovieStyle from '../stylesheets/components/user-movie.module.scss';

import defaultPoster from '../images/default-poster.png';
import { fetchOrDeleteFromApi, sortLists } from '../helpers/common';
import WaitForServer from "./wait-for-server";
import { AddToList } from "./search";

export default function MediaListsPage (props) {
    const {allLists, refreshList, listPref, mediaPref,
            listCategory, tvListNames, movieListNames} = props;
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
                    />
                ))}
            </div>
        </div>
    )
}
function ListContainer (props) {
    const {list, listCategory, refreshList, expandByDefault,
            movieListNames, tvListNames} = props;
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
    const {mediaInstants, listCategory, list, refreshList,
            tvListNames, movieListNames} = props;
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
                />
                )
            )}
        </div>
    )
}
function UserMediaCard (props) {
    const [wait, setWaitForServer] = useState(false);
    const [showMoreInfo, setShowMoreInfo] = useState(false);
    const {listCategory, list, userMedia, refreshList, tvListNames, movieListNames} = props;
    const { streamingSource, media, imdbID} = userMedia;
    const {title, posterUrl, releaseDate} = media;
    const handleRemoveFromList = () => {
        setWaitForServer(true);
        fetchOrDeleteFromApi(`lists/${listCategory}/${list._id}/${imdbID}`, 'delete')
            .then(()=>refreshList(listCategory))
            .catch(err => window.alert(err))
            .finally(() => {setWaitForServer(false)});
    };
    const handleOpenShowMoreInfo = () => {
        setShowMoreInfo(true);
    };
    const handleCloseShowMoreInfo = () => {
        setShowMoreInfo(false);
    };
    return (
    <div className={userMovieStyle.userMovie}>
        <WaitForServer
            wait={wait}
            waitText={"Removing movie from list"}
            />
        <MovieActionsMenuContainer
            handleRemoveFromList={handleRemoveFromList}
            userMedia={userMedia}
            refreshList={refreshList}
            tvListNames={tvListNames}
            movieListNames={movieListNames}
            listCategory={listCategory}
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
    // state for adding media to another list
    const [openAddToOtherList, setOpenAddToOtherList] = useState(false);
    const {handleRemoveFromList, userMedia, refreshList,
            tvListNames, movieListNames, listCategory} = props;
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
    return (
        <>
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
                        <button onClick={undefined}>Completed?</button>
                        <button
                            className={userMovieStyle.remove}
                            onClick={handleRemoveFromList}
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

