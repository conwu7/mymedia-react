import style from "../../stylesheets/pages/settings.module.scss";
import { useFormik } from "formik";
import { useState } from 'react';
import { putOrPostToApi } from "../../helpers/common";
import ListSelector from "../list-selector";
import { BiEditAlt } from 'react-icons/bi';

export function NewList (props) {
    const {handleActivityClose, refreshList} = props;
    const formik = useFormik({
        initialValues: {
            typeOfList: "towatch",
            listName: "",
            description: "",
        },
        onSubmit: async values => {
            try {
                await putOrPostToApi(
                    values,
                    `lists/${formik.values.typeOfList}`,
                    'post');
                window.alert('Success! New List created.')
                handleActivityClose();
                refreshList(values.typeOfList);
            } catch (err) {
                window.alert(err);
            }
        }
    });
    return (
        <ListForm formik={formik}/>
    )
}
export function EditList (props) {
    const {handleActivityClose, refreshList,
            tvListNames, movieListNames} = props;
    const [list, setList] = useState({});
    const [listCategory, setListCategory] = useState("");
    const [showLists, setShowLists] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const handleSelection = (list, listCategory) => {
        setList(list);
        setListCategory(listCategory);
        formik.values.typeOfList = listCategory;
        formik.values.listName = list.name;
        formik.values.description = list.description || "";
        setShowForm(true);
        setShowLists(false);
    }
    const formik = useFormik({
        initialValues: {
            typeOfList: "",
            listName: "",
            description: "",
        },
        onSubmit: async values => {
            try {
                await putOrPostToApi(
                    values,
                    `lists/${listCategory}/${list._id}`,
                    'put');
                window.alert('Success! List Updated.')
                handleActivityClose();
                refreshList(values.typeOfList);
            } catch (err) {
                window.alert(err);
            }
        }
    });
    return (
        <div className={style.editContainer}>
            {
                showLists &&
                    <ListSelector
                       showTv={true}
                       showMovies={true}
                       actionIcon={<BiEditAlt />}
                       handleSelection={handleSelection}
                       tvListNames={tvListNames.toWatchListsTv}
                       movieListNames={movieListNames.toWatchLists}
                    />
            }
            {
                showForm &&
                    <ListForm
                        formik={formik}
                        disableSelectType={true}
                    />
            }
        </div>
    )

}
function ListForm (props) {
    const {formik, disableSelectType} = props;
    return (
        <form
            onSubmit={formik.handleSubmit}
            className={style.newListForm}
        >
            <fieldset><label htmlFor="typeOfList">List Type</label>
                <select
                    name="typeOfList"
                    id="typeOfList"
                    onChange={formik.handleChange}
                    value={formik.values.typeOfList}
                    disabled={disableSelectType}
                >
                    <option value="towatch">Movies</option>
                    <option value="towatchtv">Tv Shows</option>
                </select></fieldset>
            <fieldset>
                <label htmlFor="listName">List Name</label>
                <input
                    type="text"
                    name="listName"
                    id="listName"
                    onChange={formik.handleChange}
                    value={formik.values.listName}
                />
            </fieldset>
            <fieldset>
                <label htmlFor="description">Description</label>
                <textarea
                    name="description"
                    id="description"
                    onChange={formik.handleChange}
                    value={formik.values.description}
                />
            </fieldset>
            <fieldset>
                <button type="submit">
                    Submit
                </button>
            </fieldset>
        </form>
    )
}