import { MdRadioButtonUnchecked } from 'react-icons/md';
import style from '../stylesheets/components/list-selector.module.scss';
import listStyle from '../stylesheets/components/list-button.module.scss';
import React, { useState } from 'react';
import {PopUpActivity} from "./common";
import {NewList} from "./settings/new-edit-list";

// component that shows you lists provided and executes
// the handleSelection function after clicking on one of them
export default function ListSelector (props) {
    const [isCreatingNewList, setCreatingNewList] = useState(false);
    const {showTv, showMovies, handleSelection, actionIcon,
            tvListNames, movieListNames, refreshList, hideNewListButton} = props;
    const icon = actionIcon ? actionIcon : <MdRadioButtonUnchecked />;
    const handleClick = (list, listCategory) => {
        return (() => {handleSelection(list, listCategory)})
    }
    const handleOpenNewList = () => setCreatingNewList(true);
    const handleCloseNewList = () => setCreatingNewList(false);
    return (
        <section>
            {
                showMovies &&
                <div className={listStyle.container}>
                    <p className={style.listCategory}>MOVIES</p>
                    {movieListNames.map(list => (
                        <button
                            key={list._id}
                            type="button"
                            onClick={handleClick(list, 'towatch')}
                            className={style.listButton}
                        >
                            <span>{list.name}</span>
                            {icon}
                        </button>
                    ))}
                    {movieListNames.length === 0? "-": undefined}
                </div>
            }
            {
                showTv &&
                    <div className={listStyle.container}>
                        <p className={style.listCategory}>TV SHOWS</p>
                        {tvListNames.map(list => (
                            <button
                                key={list._id}
                                type="button"
                                onClick={handleClick(list, 'towatchtv')}
                                className={style.listButton}
                            >
                                <span>{list.name}</span>
                                {icon}
                            </button>
                        ))}
                        {tvListNames.length === 0? "-": undefined}
                    </div>
            }
            {
                !hideNewListButton &&
                <section>
                    <button
                        className={style.createNewButton}
                        onClick={handleOpenNewList}
                    >
                        Create New List
                    </button>
                </section>
            }
            <PopUpActivity
                useActivity={isCreatingNewList}
                handleActivityClose={handleCloseNewList}
            >
                <NewList
                    refreshList={refreshList}
                    handleActivityClose={handleCloseNewList}
                />
            </PopUpActivity>
        </section>
    )
}