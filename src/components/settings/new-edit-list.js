import style from "../../stylesheets/pages/settings.module.scss";
import { useFormik } from "formik";
import React, { useState } from 'react';
import { putOrPostToApi } from "../../helpers/common";
import ListSelector from "../list-selector";
import { BiEditAlt } from 'react-icons/bi';
import { ListSchema } from '../../helpers/validation';
import WaitForServer from "../wait-for-server";
import { CommonStyledButton } from "../common";

export function NewList (props) {
    const {handleActivityClose, refreshList} = props;
    const [wait, setWaitForServer] = useState(false);
    const formik = useFormik({
        initialValues: {
            typeOfList: "selectOne",
            listName: "",
            description: "",
        },
        validate: (values) => (
            (values.typeOfList === "selectOne") ? {typeOfList: 'Required'} : undefined
        ),
        validationSchema: ListSchema,
        onSubmit: async values => {
            setWaitForServer(true);
            try {
                await putOrPostToApi(
                    values,
                    `lists/${formik.values.typeOfList}`,
                    'post');
                refreshList(values.typeOfList);
                handleActivityClose();
            } catch (err) {
                if (err === 'not-found') refreshList(values.typeOfList);
                window.alert(`Unsuccessful - ${err}`);
            } finally {
                setWaitForServer(false);
            }
        }
    });
    return (
        <React.Fragment>
            <ListForm formik={formik}/>
            <WaitForServer
                wait={wait}
                waitText="Creating New List"
            />
        </React.Fragment>
    )
}
export function EditList (props) {
    const [wait, setWaitForServer] = useState(false);
    const [list, setList] = useState({});
    const [listCategory, setListCategory] = useState("");
    // state. set to false after a list is selected. When false, form is shown
    const [showLists, setShowLists] = useState(true);
    const {handleActivityClose, refreshList,
        tvListNames, movieListNames} = props;
    const {toWatchListsTv} = tvListNames;
    const {toWatchLists} = movieListNames;
    // after a click from the list selector component
    const handleSelection = (list, listCategory) => {
        setList(list);
        setListCategory(listCategory);
        formik.values.typeOfList = listCategory;
        formik.values.listName = list.name;
        formik.values.description = list.description || "";
        setShowLists(false);
    }
    const formik = useFormik({
        initialValues: {
            typeOfList: "",
            listName: "",
            description: "",
        },
        validationSchema: ListSchema,
        onSubmit: async values => {
            if (
                values.listName === list.name &&
                values.description === list.description
            ) {
                return handleActivityClose();
            }
            setWaitForServer(true);
            try {
                await putOrPostToApi(
                    values,
                    `lists/${listCategory}/${list._id}`,
                    'put');
                handleActivityClose();
                refreshList(values.typeOfList);
            } catch (err) {
                if (err === 'not-found') {
                    refreshList(values.typeOfList);
                    window.alert('Unsuccessful - List could have been deleted on a different device');
                    return
                }
                window.alert(`Unsuccessful - ${err}`)
            } finally {
                setWaitForServer(false);
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
                       tvListNames={toWatchListsTv}
                       movieListNames={toWatchLists}
                       refreshList={refreshList}
                       hideNewListButton={true}
                    />
            }
            {
                !showLists &&
                    <ListForm
                        formik={formik}
                        disableSelectType={true}
                    />
            }
            <WaitForServer
                wait={wait}
                waitText={"Saving your changes"}
            />
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
                    <option value="selectOne" disabled={true}>Select One</option>
                    <option value="towatch">Movies</option>
                    <option value="towatchtv">Tv Shows</option>
                </select>
            </fieldset>
            <div className="errorDiv">
                {formik.touched.typeOfList && formik.errors.typeOfList}
            </div>
            <fieldset>
                <label htmlFor="listName">List Name</label>
                <input
                    type="text"
                    name="listName"
                    id="listName"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.listName}
                />
            </fieldset>
            <div className="errorDiv">
                {formik.errors.listName}
            </div>
            <fieldset>
                <label htmlFor="description">Description</label>
                <textarea
                    name="description"
                    id="description"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.description}
                />
            </fieldset>
            <div className="errorDiv">
                {
                    formik.errors.description &&
                    `${formik.errors.description} (Currently ${formik.values.description.length})`
                }
            </div>
            <fieldset>
                <CommonStyledButton />
            </fieldset>
        </form>
    )
}