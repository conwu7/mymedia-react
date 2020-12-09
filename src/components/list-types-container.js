// import {useState} from 'react';

import UserMovie from './user-movie';

export default function ListTypesContainer (props) {
    return (
        <ListContainer />
    )
}

function ListContainer (props) {
    return (
        <div>
            <SortSettings />
            <ListDetails />
            <UserMoviesContainer />
        </div>
    )
}

function ListDetails (props) {
    return null
}

function UserMoviesContainer (props) {
    return (
        <UserMovie />
    )
}

function SortSettings (props) {
    return null
}