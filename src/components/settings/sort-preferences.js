import style from '../../stylesheets/pages/settings.module.scss';
import { putOrPostToApi } from "../../helpers/common";
import { useFormik } from "formik";
import { useState } from 'react';
import WaitForServer from "../wait-for-server";
import {CollapsibleCard, SubmitButton} from "../common";

/*
alpha+ : alpha ascending. a-z
alpha-
created+ : created date ascending. old to new
created-
added+ : added date ascending. old to new
added-
imdb+ : rating ascending. lowest to highest
imdb-
release+ : release date ascending. oldest to newest
release-
 */

export default function SortPreferences (props) {
    const {handleActivityClose, listPref, mediaPref, updateUser} = props;
    const [wait, setWaitForServer] = useState(false);
    const [sortPreferences, setSortPreferences] = useState({
        listSortPreference: (!listPref || listPref === 'default') ? 'created+' : listPref,
        mediaSortPreference: (!mediaPref || mediaPref === 'default') ? 'added+' : mediaPref,
    })
    const handleChange = (e) => {
        setSortPreferences({
            ...sortPreferences,
            [e.target.name]: e.target.value,
        })
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (
            sortPreferences.listSortPreference === listPref &&
            sortPreferences.mediaSortPreference === mediaPref
        ) return handleActivityClose();
        setWaitForServer(true);
        try {
            await putOrPostToApi(
                sortPreferences,
                'user/sortPreferences',
                'put'
            );
            await updateUser();
            handleActivityClose();
        } catch (err) {
            if (err) alert('Unable to save. Try again');
            console.log(err);
        } finally {
            setWaitForServer(false);
        }
    }
    return (
        <div>
            <WaitForServer
                wait={wait}
                waitText="Saving your preferences"
            />
            <form
                className={style.newListForm}
                onSubmit={handleSubmit}
            >
                <fieldset>
                    <label htmlFor="typeOfList">Lists</label>
                    <select
                        name="listSortPreference"
                        id="listSortPreference"
                        onChange={handleChange}
                        value={sortPreferences.listSortPreference}
                    >
                        <option value="alpha+">Alpha - A to Z</option>
                        <option value="alpha-">Alpha - Z to A</option>
                        <option value="created+">Date Created - Old to New</option>
                        <option value="created-">Date Created - New to Old</option>
                    </select>
                </fieldset>
                <fieldset>
                    <label htmlFor="typeOfList">Media - (Movies / Shows)</label>
                    <select
                        name="mediaSortPreference"
                        id="mediaSortPreference"
                        onChange={handleChange}
                        value={sortPreferences.mediaSortPreference}
                    >
                        <option value="alpha+">Alpha - A to Z</option>
                        <option value="alpha-">Alpha - Z to A</option>
                        <option value="added+">Date Added - Old to New</option>
                        <option value="added-">Date Added - New to Old</option>
                        <option value="imdb+">IMDB Rating - Lowest to Highest</option>
                        <option value="imdb-">IMDB Rating - Highest to Lowest</option>
                        <option value="release+">Release Year - Old to New</option>
                        <option value="release-">Release Year - New to Old</option>
                    </select>
                </fieldset>
                <SubmitButton text="Save"/>
            </form>
        </div>
    )
}