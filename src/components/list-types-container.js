import React, { useState } from 'react';
import { animated, useSpring } from 'react-spring';

import {CollapsibleCard, PopUpActivity} from './common';
import EditUserMedia from "./edit-user-media";
import { HiDotsHorizontal } from 'react-icons/hi';
import { AiOutlineNodeExpand } from 'react-icons/ai';

import listContainerStyle from '../stylesheets/components/list-container.module.scss';
import userMovieStyle from '../stylesheets/components/user-movie.module.scss';

import defaultPoster from '../images/default-poster.png';
import { fetchOrDeleteFromApi, sortLists } from '../helpers/common';

export default function ListTypesContainer (props) {
    const {allLists, getLists, refreshList, setBlockAppOverflow,
            listPref, mediaPref, listCategory} = props;
    // movieSpring comes in from the left, tv show, from the right.
    const movieSpring = useSpring({
        to: {
            position: listCategory === 'towatch' ? 'relative' : 'absolute',
            top: listCategory === 'towatch' ? 0: 0,
            overflow: listCategory === 'towatch' ? 'none' : 'hidden',
            opacity: listCategory === 'towatch' ? 1 : 0,
            transform: listCategory === 'towatch' ? 'translate(0%,0)' : 'translate(-100vw,0)',
            height: listCategory === 'towatch' ? 'fit-content' : 0,
        }
    })
    const tvShowSpring = useSpring({
        to: {
            position: listCategory === 'towatchtv' ? 'relative' : 'absolute',
            top: listCategory === 'towatchtv' ? 0: 0,
            overflow: listCategory === 'towatchtv' ? 'none' : 'hidden',
            opacity: listCategory === 'towatchtv' ? 1 : 0,
            transform: listCategory === 'towatchtv' ? 'translate(0%,0)' : 'translate(100vw,0)',
            height: listCategory === 'towatchtv' ? 'fit-content' : 0,
        }
    })
    // state for editing user media popup
    const [editingUserMedia, setEditingUserMedia] = useState(false);
    const [userMediaToEdit, setUserMediaToEdit] = useState({});
    const [userMediaListCategory, setUserMediaListCategory] = useState("");
    const handleOpenEditMedia = (userMedia, listCategory) => {
        return (() => {
            setEditingUserMedia(true);
            setBlockAppOverflow(true);
            setUserMediaToEdit(userMedia);
            setUserMediaListCategory(listCategory);
        })
    }
    const handleCloseEditMedia = () => {
        setBlockAppOverflow(false);
        setEditingUserMedia(false);
    }

    return (
        <div className={listContainerStyle.allListsContainerWrapper}>
            <animated.div style={movieSpring}>
                <AllListsContainer
                    className={listContainerStyle.allListsContainer}
                    allLists={allLists}
                    listPref={listPref}
                    mediaPref={mediaPref}
                    getLists={getLists}
                    listCategory={'towatch'}
                    refreshList={refreshList}
                    handleEditUserMedia={handleOpenEditMedia}
                />
            </animated.div>
            <animated.div style={tvShowSpring}>
                <AllListsContainer
                    className={listContainerStyle.allListsContainer}
                    allLists={allLists}
                    listPref={listPref}
                    mediaPref={mediaPref}
                    getLists={getLists}
                    listCategory={'towatchtv'}
                    refreshList={refreshList}
                    handleEditUserMedia={handleOpenEditMedia}
                />
            </animated.div>
            <PopUpActivity
                useActivity={editingUserMedia}
                handleActivityClose={handleCloseEditMedia}
            >
                <EditUserMedia
                    userMedia={userMediaToEdit}
                    listCategory={userMediaListCategory}
                    refreshList={refreshList}
                    handleActivityClose={handleCloseEditMedia}
                />
            </PopUpActivity>
        </div>
    )
}
function AllListsContainer (props) {
    const {listCategory, allLists, refreshList, handleEditUserMedia,
            listPref, mediaPref} = props;
    return (
        <div className={listContainerStyle.allListsContainer}>
            {
                allLists[listCategory] && allLists[listCategory].length === 0 ?
                    <div className={listContainerStyle.emptyLists}>
                        <p>Your {listCategory === 'towatch' ? 'movies' : 'tv shows'} list is empty</p>
                        <p>To create new lists, click on "Menu" on the bottom tab</p>
                        <p>then click "Create New List"</p>
                    </div>
                    : undefined
            }
            {allLists[listCategory] &&
            sortLists(allLists[listCategory], listPref, mediaPref).map((list, index) => (
                <ListContainer 
                    key={list.name} 
                    list={list}
                    listCategory={listCategory}
                    refreshList={refreshList}
                    expandByDefault={index===0}
                    handleEditUserMedia={handleEditUserMedia}
                />
            ))}
        </div>
    )
}
function ListContainer (props) {
    const {list, listCategory, refreshList, expandByDefault, handleEditUserMedia} = props;
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
                        handleEditUserMedia={handleEditUserMedia}
                        />
                </CollapsibleCard>
        </div>
    )
}
function ListDetails (props) {
    const {list} = props;
    return (
        <div className={listContainerStyle.listDetails}>
            <h1>{list.name.toLocaleUpperCase()}</h1>
            <h2>{list.description}</h2>
        </div>
    )
}
function AllUserMediaContainer (props) {
    const {mediaInstants, listCategory, list, refreshList, handleEditUserMedia} = props;
    return (
        <div className={listContainerStyle.allUserMoviesContainer}>
            {mediaInstants.map(instant => (
                <CombinedDetails 
                    key={instant._id}
                    userMedia={instant.userMedia}
                    listCategory={listCategory}
                    list={list}
                    refreshList={refreshList}
                    handleEditUserMedia={handleEditUserMedia}
                />
                )
            )}
        </div>
    )
}
function CombinedDetails (props) { //temporarily using this to mix the positions of each details collapsible card
    const {listCategory, list, userMedia, refreshList, handleEditUserMedia} = props;
    const {isWatched, toWatchNotes, reviewNotes,
        userRating, media, imdbID} = userMedia;
    const handleRemoveFromList = () => {
        fetchOrDeleteFromApi(`lists/${listCategory}/${list._id}/${imdbID}`, 'delete')
            .then(()=>refreshList(listCategory))
            .catch(err => window.alert(err));
    };
    return (
    <div className={userMovieStyle.userMovie}>
        <MovieActions
            handleRemoveFromList={handleRemoveFromList}
            handleEditUserMedia={handleEditUserMedia}
            listCategory={listCategory}
            userMedia={userMedia}
        />
        <div className={userMovieStyle.menuSpace}>Hello There</div>
        <div className={userMovieStyle.movieDetails}>
            <div className={userMovieStyle.posterContainer}>
                <img 
                    src={media.posterUrl || defaultPoster}
                    alt={media.title+" poster"}
                    className={userMovieStyle.poster}
                    />
            </div>
            <h1 className={userMovieStyle.movieTitle}>{media.title}</h1>
            <p className={userMovieStyle.streamingSource}>
                {userMedia.streamingSource && userMedia.streamingSource.toUpperCase()}
            </p>
            <p className={userMovieStyle.imdbRating}>
                <a href={`https://imdb.com/title/${media.imdbID}`} target="_blank" rel="noopener noreferrer">IMDB</a> <span>{media.imdbRating || "-"}</span>/10
            </p>
            <p className={userMovieStyle.releaseDate}><span>{media.releaseDate}</span></p>
            <CollapsibleCard
                cardHeader="Watch Notes"
                isCollapsed={true}
                hideButton={false}
                collapseButton={<AiOutlineNodeExpand />}
            >
                <ToWatchNotes toWatchNotes={toWatchNotes}/>
            </CollapsibleCard>
            <CollapsibleCard
                cardHeader="Plot"
                isCollapsed={true}
                hideButton={false}
                collapseButton={<AiOutlineNodeExpand />}
            >
                <p>{media.plot || "-"}</p>
            </CollapsibleCard>
            <WatchStatus {...{isWatched}} />
            {isWatched?
            (
                <CollapsibleCard
                    cardHeader="Your Review"
                    isCollapsed={true}
                    hideButton={false}
                    collapseButton={<AiOutlineNodeExpand />}
                >
                    <UserNotesAndRating
                        userRating={userRating}
                        reviewNotes={reviewNotes}
                    />
                </CollapsibleCard>
            )
            :null}
        </div>
    </div>
    )
}
function MovieActions (props) {
    const {handleRemoveFromList, handleEditUserMedia, listCategory, userMedia} = props;
    return (
        <div className={userMovieStyle.menuContainer}>
            <CollapsibleCard 
                collapseButton={<HiDotsHorizontal />}
                skipAllStyling={true}
                isCollapsed={true}
                hideOnFocusLost={true}
            >
                <div className={userMovieStyle.buttonContainer}>
                    <button
                        onClick={handleEditUserMedia(userMedia, listCategory)}
                    >
                        Edit
                    </button>
                    <button 
                        className={userMovieStyle.remove}
                        onClick={handleRemoveFromList}
                    >
                        Remove
                    </button>
                </div>
            </CollapsibleCard>
        </div>
    )
}
function ToWatchNotes (props) {
    return (
        <p>{props.toWatchNotes || "-"}</p>
    )
}
function WatchStatus (props) {
    return null
}
function UserNotesAndRating (props) {
    return (
        <div>
            <p>{props.userRating===0?"-":props.userRating}/10</p>
            <p>{props.reviewNotes || "-"}</p>
        </div>
    )
}

