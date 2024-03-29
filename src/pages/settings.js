import React, { useState } from "react"
import { putOrPostToApi } from "../helpers/common"
import { HiOutlineSortAscending } from "react-icons/hi"
import {
   RiEditLine,
   RiLogoutCircleLine,
   RiDeleteBin2Line,
   RiEditBoxLine,
   RiFeedbackLine
} from "react-icons/ri"
import style from "../stylesheets/pages/settings.module.scss"
import { PopUpActivity } from "../components/common"
import { EditList, NewList } from "../components/settings/new-edit-list"
import DeleteList from "../components/settings/delete-list"
import Preferences from "../components/settings/preferences"
import { Feedback } from "../components/settings/feedback"

export default function Settings(props) {
   // state for new list popup
   const [creatingNewList, setCreatingNewList] = useState(false)
   // state for edit list popup
   const [editingList, setEditingList] = useState(false)
   // state for delete list popup
   const [deletingList, setDeletingList] = useState(false)
   // state for modify sort preferences popup
   const [modifyingSortPref, setModifyingSortPref] = useState(false)
   // state for feedback form popup
   const [openFeedback, setOpenFeedback] = useState(false)
   const {
      refreshList,
      tvListNames,
      movieListNames,
      updateUser,
      listPref,
      mediaPref,
      defaultMediaPage
   } = props
   const handleLogout = async () => {
      try {
         if (!window.confirm("Are you sure you want to logout?")) return
         await putOrPostToApi({}, "logout", "post")
         window.location.reload()
      } catch (err) {
         alert(err)
      }
   }
   const handleOpenNewList = () => {
      setCreatingNewList(true)
   }
   const handleCloseNewList = () => {
      setCreatingNewList(false)
   }
   const handleOpenEditList = () => {
      setEditingList(true)
   }
   const handleCloseEditList = () => {
      setEditingList(false)
   }
   const handleOpenDeleteList = () => {
      setDeletingList(true)
   }
   const handleCloseDeleteList = () => {
      setDeletingList(false)
   }
   const handleOpenModifySortPref = () => {
      setModifyingSortPref(true)
   }
   const handleCloseModifySortPref = () => {
      setModifyingSortPref(false)
   }
   const handleOpenFeedback = () => {
      setOpenFeedback(true)
   }
   const handleCloseFeedBack = () => {
      setOpenFeedback(false)
   }
   return (
      <div className={style.settingsContainer}>
         <button className={style.mainLinks} onClick={handleOpenNewList}>
            Create New List
            <RiEditBoxLine />
         </button>
         <button className={style.mainLinks} onClick={handleOpenEditList}>
            <span>Edit Lists</span>
            <RiEditLine />
         </button>
         <button
            onClick={handleOpenDeleteList}
            className={`${style.deleteList} ${style.mainLinks}`}
         >
            <span>Delete Lists</span>
            <RiDeleteBin2Line />
         </button>
         <button className={style.mainLinks} onClick={handleOpenModifySortPref}>
            <span>Preferences</span>
            <HiOutlineSortAscending />
         </button>
         <button
            className={`${style.mainLinks} ${style.feedback}`}
            onClick={handleOpenFeedback}
         >
            <span>Submit Feedback</span>
            <RiFeedbackLine />
         </button>
         <button
            onClick={handleLogout}
            className={`${style.logout} ${style.mainLinks}`}
         >
            <span>Logout</span>
            <RiLogoutCircleLine />
         </button>
         <PopUpActivity
            // NEW LIST
            useActivity={creatingNewList}
            handleActivityClose={handleCloseNewList}
         >
            <NewList
               refreshList={refreshList}
               handleActivityClose={handleCloseNewList}
            />
         </PopUpActivity>
         <PopUpActivity
            // EDIT LIST
            useActivity={editingList}
            handleActivityClose={handleCloseEditList}
         >
            <EditList
               refreshList={refreshList}
               handleActivityClose={handleCloseEditList}
               tvListNames={tvListNames}
               movieListNames={movieListNames}
            />
         </PopUpActivity>
         <PopUpActivity
            // DELETE LIST
            useActivity={deletingList}
            handleActivityClose={handleCloseDeleteList}
         >
            <DeleteList
               refreshList={refreshList}
               movieListNames={movieListNames}
               tvListNames={tvListNames}
               handleActivityClose={handleCloseDeleteList}
            />
         </PopUpActivity>
         <PopUpActivity
            // USER PREFERENCES
            useActivity={modifyingSortPref}
            handleActivityClose={handleCloseModifySortPref}
         >
            <Preferences
               listPref={listPref}
               mediaPref={mediaPref}
               defaultMediaPage={defaultMediaPage}
               updateUser={updateUser}
               handleActivityClose={handleCloseModifySortPref}
            />
         </PopUpActivity>
         <PopUpActivity
            // FEEDBACK FORM
            useActivity={openFeedback}
            handleActivityClose={handleCloseFeedBack}
         >
            <Feedback handleActivityClose={handleCloseFeedBack} />
         </PopUpActivity>
      </div>
   )
}
