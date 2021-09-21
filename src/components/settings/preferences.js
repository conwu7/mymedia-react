import style from "../../stylesheets/pages/settings.module.scss"
import { putOrPostToApi } from "../../helpers/common"
import { useState } from "react"
import WaitForServer from "../wait-for-server"
import { CommonStyledButton } from "../common"

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

export default function Preferences(props) {
   const {
      handleActivityClose,
      listPref,
      mediaPref,
      updateUser,
      defaultMediaPage
   } = props
   const [wait, setWaitForServer] = useState(false)
   const [preferences, setSortPreferences] = useState({
      listSortPreference:
         !listPref || listPref === "default" ? "created+" : listPref,
      mediaSortPreference:
         !mediaPref || mediaPref === "default" ? "added+" : mediaPref,
      defaultMediaPage: defaultMediaPage || "movies"
   })
   const handleChange = (e) => {
      setSortPreferences({
         ...preferences,
         [e.target.name]: e.target.value
      })
   }
   const handleSubmit = async (e) => {
      e.preventDefault()
      if (
         preferences.listSortPreference === listPref &&
         preferences.mediaSortPreference === mediaPref &&
         preferences.defaultMediaPage === defaultMediaPage
      )
         return handleActivityClose()
      setWaitForServer(true)
      try {
         await putOrPostToApi(preferences, "user/preferences", "put")
         await updateUser()
         handleActivityClose()
      } catch (err) {
         if (err) alert("Unable to save. Try again")
      } finally {
         setWaitForServer(false)
      }
   }
   return (
      <div>
         <WaitForServer wait={wait} waitText="Saving your preferences" />
         <form className={style.newListForm} onSubmit={handleSubmit}>
            <fieldset>
               <label htmlFor="typeOfList">Lists</label>
               <select
                  name="listSortPreference"
                  id="listSortPreference"
                  onChange={handleChange}
                  value={preferences.listSortPreference}
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
                  value={preferences.mediaSortPreference}
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
            <fieldset>
               <label htmlFor="defaultMediaPage">Default Tab</label>
               <select
                  name="defaultMediaPage"
                  id="defaultMediaPage"
                  onChange={handleChange}
                  value={preferences.defaultMediaPage}
               >
                  <option value="movies">Movies</option>
                  <option value="tvShows">Tv Shows</option>
               </select>
            </fieldset>
            <CommonStyledButton text="Save" />
         </form>
      </div>
   )
}
