import { useEffect } from 'react';
import { Route, Switch, useRouteMatch, useLocation } from 'react-router-dom';
import { useTransition, animated } from 'react-spring';

import { CollapsibleCard } from '../components/common';
import { HiDotsHorizontal } from 'react-icons/hi';

import listContainerStyle from '../stylesheets/components/list-container.module.scss';
import userMovieStyle from '../stylesheets/components/user-movie.module.scss';

import defaultPoster from '../images/default-poster.png';
import { deleteFromApi } from '../helpers/common';

export default function ListTypesContainer (props) {
    const { categories, allLists, getLists, refreshList } = props;
    let { path } = useRouteMatch();
    const location = useLocation();
    const transitions = useTransition(
        location, 
        location => location.pathname,
        {
            from: {
                position: 'absolute',
                width: '100%',
                opacity: 0,
                transform: 'translate(100%,0)'
          },
            enter: { opacity: 1, transform: 'translate(0%,0)' },
            leave: { opacity: 0,transform: 'translate(0, 100%)' },
        }
    );
    return (
        transitions.map(({item, props, key}) => (
            <animated.div 
                key={key} 
                style={props}
            >
                <Switch location={item}>
                    {/* <ListContainer /> */}
                    
                    {categories.map(category => (
                        <Route 
                            key={category.name}
                            path={path+'/lists/'+category.name} 
                            >
                                <AllListsContainer 
                                    allLists={allLists}
                                    getLists={getLists}
                                    listCategory={category.name}
                                    refreshList={refreshList}
                                />
                        </Route>
                    ))}
                </Switch>
            </animated.div>
        ))
    )
}
function AllListsContainer (props) {
    const {listCategory, allLists, getLists, refreshList} = props;
    useEffect(() => {
        if (typeof allLists[listCategory] === 'undefined') {
            getLists(listCategory);
        }
    }, [listCategory, getLists, allLists]);
    return (
        <div className={listContainerStyle.allListsContainer}>
            <SortSettings />
            {allLists[listCategory] && allLists[listCategory].map(list => (
                <ListContainer 
                    key={list.name} 
                    list={list}
                    listCategory={listCategory}
                    refreshList={refreshList}
                />
            ))}
        </div>
    )
}
function SortSettings (props) {
    return null
}
function ListContainer (props) {
    const {list, listCategory, refreshList} = props;
    return (
        <div className={listContainerStyle.listContainer}>
                <CollapsibleCard 
                    cardHeader={<ListDetails list={list}/>} 
                    skipStyleHeader={true}
                    buttonSize="largeBtn"
                    isCollapsed={true}
                    disableHeaderButton={true}
                >
                    <AllUserMoviesContainer 
                        userMoviesInstants={list.userMovieInstants}
                        listCategory={listCategory}
                        list={list}
                        refreshList={refreshList}
                        />
                </CollapsibleCard>
        </div>
    )
}
function ListDetails (props) {
    const {list} = props;
    return (
        <div className={listContainerStyle.listDetails}>
            <h1>{list.name}</h1>
            <h2>{list.description}</h2>
        </div>
    )
}
function AllUserMoviesContainer (props) {
    const {userMoviesInstants, listCategory, list, refreshList} = props;
    return (
        <div className={listContainerStyle.allUserMoviesContainer}>
            {userMoviesInstants.map(instant => (
                <CombinedDetails 
                    key={instant._id}
                    userMovie={instant.userMovie}
                    listCategory={listCategory}
                    list={list}
                    refreshList={refreshList}
                />
                )
            )}
        </div>
    )
}
function CombinedDetails (props) { //temporarily using this to mix the positions of each details collapsible card
    const {listCategory, list, userMovie, refreshList} = props;
    const {isWatched, toWatchNotes, reviewNotes, 
        userRating, movie, imdbID} = userMovie;
    const handleRemoveFromList = () => {
        deleteFromApi(`lists/${listCategory}/${list.name}/${imdbID}`)
            .then(()=>refreshList(listCategory))
            .catch(err => window.alert(err));
    };
    return (
    <div className={userMovieStyle.userMovie}>
        <MovieActions handleRemoveFromList={handleRemoveFromList}/>
        <div className={userMovieStyle.menuSpace}></div>
        <div className={userMovieStyle.movieDetails}>
            <div className={userMovieStyle.posterContainer}>
                <img 
                    src={movie.posterUrl || defaultPoster} 
                    alt={movie.title+" poster"} 
                    className={userMovieStyle.poster}
                    />
            </div>
            <h1 className={userMovieStyle.movieTitle}>{movie.title}</h1>
            <CollapsibleCard 
                cardHeader="Details" 
                isCollapsed={false} 
                hideButton={true}
                >
                <p className={userMovieStyle.imdbRating}>
                    <a href={`https://imdb.com/title/${movie.imdbID}`} target="_blank" rel="noopener noreferrer">IMDB</a> <span>{movie.imdbRating || "-"}</span>/10
                </p>
                <p className={userMovieStyle.releaseDate}>Released on <span>{movie.releaseDate}</span></p>
                <CollapsibleCard cardHeader="Watch Notes" isCollapsed={false} hideButton={true}>
                    <ToWatchNotes toWatchNotes={toWatchNotes}/>
                </CollapsibleCard>
                <CollapsibleCard cardHeader="Plot" isCollapsed={true} hideButton={true}>
                    <p>{movie.plot || "-"}</p>
                </CollapsibleCard>
                <WatchStatus {...{isWatched}} />
                {isWatched? 
                (
                    <CollapsibleCard cardHeader="Review" isCollapsed={true} hideButton={true}>
                        <UserNotesAndRating 
                            userRating={userRating}
                            reviewNotes={reviewNotes}
                        />
                    </CollapsibleCard>
                )
                :null}
            </CollapsibleCard>
        </div>
    </div>
    )
}
function MovieActions (props) {
    const {handleRemoveFromList} = props;
    return (
        <div className={userMovieStyle.menuContainer}>
            <CollapsibleCard 
                collapseButton={<HiDotsHorizontal />}
                skipAllStyling={true}
                isCollapsed={true}
                hideOnFocusLost={true}
            >
                <div className={userMovieStyle.buttonContainer}>
                    <button>Edit</button>
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
            <p>User Rating - {props.userRating}</p>
            <p>{props.reviewNotes || "-"}</p>
        </div>
    )
}

