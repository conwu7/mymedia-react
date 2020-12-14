import {useEffect, useState} from 'react';
import {Route, useRouteMatch} from 'react-router-dom';

import listContainerStyle from '../stylesheets/components/list-container.module.scss';
import userMovieStyle from '../stylesheets/components/user-movie.module.scss';
import {CollapsibleCard} from '../components/common';

import {fetchListsByCategory} from '../helpers/common';

import defaultPoster from '../images/default-poster.png';

export default function ListTypesContainer (props) {
    let { path } = useRouteMatch();
    return (
        <div>
            {/* <ListContainer /> */}
            
            {props.categories.map(category => (
                <Route 
                    key={category.name}
                    path={path+'/lists/'+category.name} 
                    >
                        <AllListsContainer category={category.name}/>
                </Route>
            ))}
        </div>
    )
}

function AllListsContainer (props) {
    const [lists, setLists] = useState([]);
    useEffect(() => {
        fetchListsByCategory(props.category)
        .then(lists => setLists(lists))
        .catch(err => console.log(err))
    }, [props.category])
    return (
        <div className={listContainerStyle.allListsContainer}>
            <SortSettings />
            {lists.map(list => (
                <ListContainer 
                    key={list.name} 
                    list={list}
                />
            ))}
        </div>
    )
}

function SortSettings (props) {
    return null
}

function ListContainer (props) {
    const {list} = props;
    return (
        <div 
            className={listContainerStyle.listContainer}
            >
                <CollapsibleCard 
                    cardHeader={<ListDetails list={list}/>} 
                    skipStyleHeader={true}
                    buttonSize="largeBtn"
                >
                    <AllUserMoviesContainer userMoviesInstants={list.userMovieInstants}/>
                </CollapsibleCard>
        </div>
    )
}

function ListDetails (props) {
    const {list} = props;
    return (
        <div>
            <h1>{list.name}</h1>
            <h2>{list.description}</h2>
        </div>
    )
}

function AllUserMoviesContainer (props) {
    const {userMoviesInstants} = props;
    return (
        <div className={listContainerStyle.allUserMoviesContainer}>
            {userMoviesInstants.map(instant => (
                <UserMovie 
                    key={instant._id}
                    userMovie={instant.userMovie}
                    />
            ))}
        </div>
    )
}

function UserMovie (props) {
    // return (
    //     <div className={userMovieStyle.userMovie}>
    //         <MovieDetails movie={props.userMovie.movie}/>
    //         <UserMovieUserDetails userMovie={props.userMovie}/>
    //     </div>
    // )
    return (
        <CombinedDetails userMovie={props.userMovie}/>
    )
}

function CombinedDetails (props) { //temporarily using this to mix the positions of each details collapsible card
    const {isWatched, toWatchNotes, reviewNotes, userRating, movie} = props.userMovie;
    return (
        <div className={userMovieStyle.userMovie}>
        <div className={userMovieStyle.movieDetails}>
            <div className={userMovieStyle.posterContainer}>
                <img 
                    src={movie.posterUrl || defaultPoster} 
                    alt={movie.title+" poster"} 
                    className={userMovieStyle.poster}
                    />
            </div>
            <h1 className={userMovieStyle.movieTitle}>{movie.title}</h1>
            <CollapsibleCard cardHeader="To Watch Notes" isCollapsed={true}>
                <ToWatchNotes {...{toWatchNotes}}/>
            </CollapsibleCard>
            <CollapsibleCard cardHeader="Info" isCollapsed={true}>
                <p className={userMovieStyle.imdbRating}>IMDB <span>{movie.imdbRating || "-"}</span>/10</p>
                <p className={userMovieStyle.releaseDate}>Released on <span>{movie.releaseDate}</span></p>
            </CollapsibleCard>
            <CollapsibleCard isCollapsed={true} cardHeader={"Plot"}>
                <p>{movie.plot || "-"}</p>
            </CollapsibleCard>
            <WatchStatus {...{isWatched}} />
            {isWatched? 
            (
                <CollapsibleCard isCollapsed={true} cardHeader="User Review">
                    <UserNotesAndRating {...{userRating, reviewNotes}} />
                </CollapsibleCard>
            )
            :null}
        </div>
    </div>
    )
}

// function MovieDetails (props) {
//     const {movie} = props;
//     return (
//         <div className={userMovieStyle.movieDetails}>
//             <div className={userMovieStyle.posterContainer}>
//                 <img 
//                     src={movie.posterUrl || defaultPoster} 
//                     alt={movie.title+" poster"} 
//                     className={userMovieStyle.poster}
//                     />
//             </div>
//             <h1>{movie.title}</h1>
//             <CollapsibleCard cardHeader="Info">
//                 <p className={userMovieStyle.imdbRating}>IMDB <span>{movie.imdbRating || "-"}</span>/10</p>
//                 <p className={userMovieStyle.releaseDate}>Released on <span>{movie.releaseDate}</span></p>
//             </CollapsibleCard>
//             <CollapsibleCard isCollapsed={true} cardHeader={"Plot"}>
//                 <p>{movie.plot || "-"}</p>
//             </CollapsibleCard>
//         </div>
//     )
// }

// function UserMovieUserDetails (props) {
//     const {isWatched, toWatchNotes, reviewNotes, userRating} = props.userMovie;
//     return (
//         <div className={userMovieStyle.userMovieDetails} >
//             <CollapsibleCard cardHeader="To Watch Notes">
//                 <ToWatchNotes {...{toWatchNotes}}/>
//             </CollapsibleCard>
//             <WatchStatus {...{isWatched}} />
//             {isWatched? 
//             (
//                 <CollapsibleCard isCollapsed={true} cardHeader="User Review">
//                     <UserNotesAndRating {...{userRating, reviewNotes}} />
//                 </CollapsibleCard>
//             )
//             :null}
//         </div>
//     )
// }

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

