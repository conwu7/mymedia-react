import { useFormik } from "formik"
import { putOrPostToApi } from "../helpers/common"
import style from "../stylesheets/components/edit-user-media.module.scss"
import defaultPoster from "../images/default-poster.png"
import {
   CollapsibleCard,
   StreamingSourceFieldset,
   CommonStyledButton
} from "./common"
import { FiCheckCircle, FiXCircle, FiStar } from "react-icons/fi"
import React, { useState } from "react"
import { UserMediaSchema } from "../helpers/validation"
import WaitForServer from "./wait-for-server"

export default function EditUserMedia(props) {
   const {
      userMedia,
      listCategory,
      handleActivityClose,
      refreshList,
      isCompleting
   } = props
   const [wait, setWaitForServer] = useState(false)
   const userMediaType =
      listCategory === "towatchtv" ? "userTvShows" : "userMovies"
   const { media } = userMedia
   // state only used for styling. classname won't update if you use formik.values on it
   const [isWatched, setWatchStatus] = useState(userMedia.isWatched)
   const formik = useFormik({
      initialValues: {
         toWatchNotes: userMedia.toWatchNotes || "",
         isWatched: !!userMedia.isWatched,
         userRating: userMedia.userRating || 0,
         reviewNotes: userMedia.reviewNotes || "",
         streamingSource: userMedia.streamingSource || "selectOne"
      },
      validate: (values) =>
         values.streamingSource === "selectOne"
            ? { streamingSource: "Required" }
            : undefined,
      validationSchema: UserMediaSchema,
      onSubmit: async (values) => {
         if (
            values.toWatchNotes === userMedia.toWatchNotes &&
            values.isWatched === userMedia.isWatched &&
            values.userRating === userMedia.userRating &&
            values.reviewNotes === userMedia.reviewNotes &&
            values.streamingSource === userMedia.streamingSource &&
            !isCompleting
         ) {
            return handleActivityClose()
         }
         setWaitForServer(true)
         try {
            await putOrPostToApi(
               values,
               `${userMediaType}/${userMedia.imdbID}`,
               "put"
            )
            refreshList(listCategory)
            handleActivityClose(isCompleting ? "markComplete" : undefined)
         } catch (err) {
            window.alert(err)
         } finally {
            setWaitForServer(false)
         }
      }
   })
   // handle clicking yes or no for media watched status
   const handleWatched = (newStatus) => {
      return () => {
         formik.values.isWatched = newStatus
         setWatchStatus(newStatus)
      }
   }
   // handle clicking stars on rating section
   const handleRating = (newRating) => {
      formik.values.userRating = newRating
   }
   return (
      <div className={style.editUserMediaContainer}>
         <WaitForServer wait={wait} waitText="Saving your changes" />
         <section className={style.posterAndTitleContainer}>
            <div className={style.mediaPosterContainer}>
               <img
                  src={media.posterUrl || defaultPoster}
                  alt={`${media.title} poster`}
                  className={style.mediaPoster}
               />
            </div>
            <div className={style.mediaTitleContainer}>
               <h1 className={style.mediaTitle}>{media.title}</h1>
            </div>
         </section>
         <section>
            <form className={style.form} onSubmit={formik.handleSubmit}>
               {!isCompleting && (
                  <>
                     <StreamingSourceFieldset formik={formik} />
                     <div className="errorDiv">
                        {formik.errors.streamingSource &&
                           `${formik.errors.streamingSource}`}
                     </div>
                  </>
               )}
               {!isCompleting && (
                  <UserMediaTextFields
                     formik={formik}
                     fieldName="toWatchNotes"
                     fieldText="Watch Notes"
                  />
               )}
               <div className={style.fieldContainer}>
                  <span>Watched?</span>
                  <div className={style.watchStatusContainer}>
                     <button
                        type="button"
                        className={`${style.watchStatusButton} ${
                           isWatched ? style.watched : ""
                        }`}
                        onClick={handleWatched(true)}
                     >
                        <FiCheckCircle />
                     </button>
                     <button
                        type="button"
                        className={`${style.watchStatusButton} ${
                           !isWatched ? style.notWatched : ""
                        }`}
                        onClick={handleWatched(false)}
                     >
                        <FiXCircle />
                     </button>
                  </div>
               </div>
               <div className={style.fieldContainer}>
                  <span>Your Rating</span>
                  <RatingStars
                     rating={formik.values.userRating}
                     maxRating={10}
                     handleRating={handleRating}
                  />
               </div>
               <UserMediaTextFields
                  formik={formik}
                  fieldName="reviewNotes"
                  fieldText="Review Notes"
               />
               <CommonStyledButton text="Save" />
            </form>
         </section>
      </div>
   )
}
function UserMediaTextFields(props) {
   const { formik, fieldName, fieldText } = props
   return (
      <div className={style.fieldContainer}>
         <CollapsibleCard
            isCollapsed={true}
            cardHeader={
               <div>
                  <label htmlFor={fieldName} className={style.label}>
                     Expand to edit {fieldText}
                  </label>
               </div>
            }
            skipStyleHeader={true}
         >
            <textarea
               id={fieldName}
               name={fieldName}
               onChange={formik.handleChange}
               onBlur={formik.handleBlur}
               onSubmit={formik.handleSubmit}
               value={formik.values[fieldName]}
               className={style.textarea}
            />
         </CollapsibleCard>
         <div className="errorDiv">
            {formik.errors[fieldName] &&
               `${formik.errors[fieldName]} (Currently ${formik.values[fieldName].length})`}
         </div>
      </div>
   )
}
function RatingStars(props) {
   const { rating, handleRating, maxRating } = props
   // using state here cause styling doesn't change when using formik.values.userRating (props.rating)
   const [localRating, setLocalRating] = useState(rating)
   let starMap = []
   for (let i = 1; i < maxRating + 1; i++) {
      starMap.push(i)
   }
   const handleSelection = (starNumber) => {
      return () => {
         handleRating(starNumber)
         setLocalRating(starNumber)
      }
   }
   return (
      <div className={style.ratingStarsContainer}>
         {starMap.map((star) => (
            <button
               type="button"
               key={star}
               onClick={handleSelection(star)}
               className={`${style.ratingStarButtons} ${
                  star <= localRating ? style.shadedStars : ""
               }`}
            >
               <FiStar />
            </button>
         ))}
      </div>
   )
}
