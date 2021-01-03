import style from '../../stylesheets/pages/settings.module.scss';
import { putOrPostToApi } from "../../helpers/common";
import { useFormik } from "formik";

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
    const formik = useFormik({
        initialValues: {
            listSortPreference: listPref || 'created+',
            mediaSortPreference: mediaPref || 'added+',
        },
        onSubmit: async values => {
            try {
                await putOrPostToApi(
                    formik.values,
                    'user/sortPreferences',
                    'put'
                );
                await updateUser();
                handleActivityClose();
            } catch (err) {
                if (err) alert('Unable to save. Try again');
                console.log(err);
            }
        }
    })
    return (
        <div>
            <form
                className={style.newListForm}
                onSubmit={formik.handleSubmit}
            >
                <fieldset>
                    <label htmlFor="typeOfList">Lists</label>
                    <select
                        name="listSortPreference"
                        id="listSortPreference"
                        onChange={formik.handleChange}
                        value={formik.values.listSortPreference}
                    >
                        <option value="alpha+">Alpha - A to Z</option>
                        <option value="alpha-">Alpha - Z to A</option>
                        <option value="created+">Date Created - Old to New</option>
                        <option value="created-">Date Created - New to Old</option>
                    </select></fieldset>
                <fieldset><label htmlFor="typeOfList">Media - (Movies / Shows)</label>
                    <select
                        name="mediaSortPreference"
                        id="mediaSortPreference"
                        onChange={formik.handleChange}
                        value={formik.values.mediaSortPreference}
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
                <button type="submit">Save</button>
            </form>
        </div>
    )
}