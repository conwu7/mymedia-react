import { MdRadioButtonUnchecked } from "react-icons/md"
import style from "../stylesheets/components/list-selector.module.scss"
import React, { useState } from "react"
import { PopUpActivity, CommonStyledButton } from "./common"
import { NewList } from "./settings/new-edit-list"

// component that shows you lists provided and executes
// the handleSelection function after clicking on one of them
export default function ListSelector(props) {
   const [isCreatingNewList, setCreatingNewList] = useState(false)
   const {
      showTv,
      showMovies,
      handleSelection,
      actionIcon,
      tvListNames,
      movieListNames,
      refreshList,
      hideNewListButton
   } = props
   const icon = actionIcon ? actionIcon : <MdRadioButtonUnchecked />
   const handleClick = (list, listCategory) => {
      return () => {
         handleSelection(list, listCategory)
      }
   }
   const handleOpenNewList = () => setCreatingNewList(true)
   const handleCloseNewList = () => setCreatingNewList(false)
   return (
      <section>
         {showMovies && (
            <>
               <p className={style.listCategory}>MOVIES</p>
               {movieListNames.map((list) => (
                  <button
                     key={list._id}
                     type="button"
                     onClick={handleClick(list, "towatch")}
                     className={style.listButton}
                  >
                     <span>{list.name}</span>
                     {icon}
                  </button>
               ))}
               {movieListNames.length === 0 ? "-" : undefined}
            </>
         )}
         {showTv && (
            <>
               <p className={style.listCategory}>TV SHOWS</p>
               {tvListNames.map((list) => (
                  <button
                     key={list._id}
                     type="button"
                     onClick={handleClick(list, "towatchtv")}
                     className={style.listButton}
                  >
                     <span>{list.name}</span>
                     {icon}
                  </button>
               ))}
               {tvListNames.length === 0 ? "-" : undefined}
            </>
         )}
         {!hideNewListButton && (
            <section>
               <CommonStyledButton
                  type="button"
                  onClick={handleOpenNewList}
                  text="Create New List"
               />
            </section>
         )}
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
