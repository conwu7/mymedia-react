import { useFormik } from "formik";
import { putOrPostToApi } from "../helpers/common";
import style from '../stylesheets/components/edit-user-media.module.scss';
import searchStyle from '../stylesheets/components/search.module.scss';
import defaultPoster from '../images/default-poster.png';
import { CollapsibleCard } from "./common";
import { FiCheckCircle, FiXCircle, FiStar } from 'react-icons/fi';
import React, { useState } from "react";
import { UserMediaSchema } from '../helpers/validation';

export default function EditUserMedia (props) {
    const {userMedia, listCategory, handleActivityClose, refreshList} = props;
    const userMediaType = listCategory==="towatchtv"?"userTvShows":"userMovies";
    const {media} = userMedia;
    // state only used for styling. classname won't update if you use formik.values on it
    const [isWatched, setWatchStatus] = useState(userMedia.isWatched);
    const formik = useFormik({
        initialValues: {
            toWatchNotes: userMedia.toWatchNotes || "",
            isWatched: !!userMedia.isWatched,
            userRating: userMedia.userRating || 0,
            reviewNotes: userMedia.reviewNotes || "",
            streamingSource: userMedia.streamingSource || "",
        },
        validationSchema: UserMediaSchema,
        onSubmit: async values => {
            try {
                await putOrPostToApi(
                    values,
                    `${userMediaType}/${userMedia.imdbID}`,
                    'put'
                )
                refreshList(listCategory);
                handleActivityClose();
            } catch (err) {
                window.alert(err);
            }
        }
    })
    // handle clicking yes or no for media watched status
    const handleWatched = (newStatus) => {
        return (() => {
            formik.values.isWatched = newStatus;
            setWatchStatus(newStatus);
        })
    }
    // handle clicking stars on rating section
    const handleRating = (newRating) => {
        formik.values.userRating = newRating;
    }
    return (
        <div className={style.editUserMediaContainer}>
            <section className={style.posterAndTitleContainer}>
                <div className={style.mediaPosterContainer}>
                    <img
                        src={media.posterUrl || defaultPoster}
                        alt={media.title + " poster"}
                        className={style.mediaPoster}
                    />
                </div>
                <div className={style.mediaTitleContainer}>
                    <h1 className={style.mediaTitle}>{media.title}</h1>
                </div>
            </section>
            <section>
                <form
                    className={style.form}
                    onSubmit={formik.handleSubmit}
                >
                    <fieldset className={searchStyle.streamingSource}>
                        <label htmlFor="streamingSource">Streaming Source</label>
                        <input
                            name="streamingSource"
                            id="streamingSource"
                            list="streamingSources"
                            onChange={formik.handleChange}
                            value={formik.values.streamingSource}
                        />
                        <datalist id="streamingSources">
                            <option value="NETFLIX"/>
                            <option value="HBO"/>
                            <option value="AMAZON"/>
                            <option value="DISNEY+"/>
                            <option value="HULU"/>
                            <option value="PEACOCK"/>
                            <option value="BUY/RENT"/>
                        </datalist>
                    </fieldset>
                    <UserMediaTextFields
                        formik={formik}
                        fieldName="toWatchNotes"
                        fieldText="Watch Notes"
                    />
                    <div>
                        <span>Watched?</span>
                        <div className={style.watchStatusButtons}>
                            <button
                                type="button"
                                className={isWatched?style.watched:""}
                                onClick={handleWatched(true)}
                            >
                                <FiCheckCircle />
                            </button>
                            <button
                                type="button"
                                className={!isWatched?style.notWatched:""}
                                onClick={handleWatched(false)}
                            >
                                <FiXCircle />
                            </button>
                        </div>
                    </div>
                    <div>
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
                    <button
                        className={style.saveChanges}
                        type={"submit"}>
                        Save
                    </button>
                </form>
            </section>
        </div>
    )
}
function UserMediaTextFields (props) {
    const {formik, fieldName, fieldText} = props;
    return (
        <div className={style[fieldName]}>
            <CollapsibleCard
                isCollapsed={true}
                cardHeader={
                    <div>
                        <label htmlFor={fieldName}>
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
                                />
            </CollapsibleCard>
            <div className="errorDiv">
                {formik.touched[fieldName] && formik.errors[fieldName]}
            </div>
        </div>
    )
}
function RatingStars (props) {
    const {rating, handleRating, maxRating} = props;
    // using state here cause styling doesn't change when using formik.values.userRating (props.rating)
    const [localRating, setLocalRating] = useState(rating);
    let starMap = [];
    for (let i=1; i<maxRating+1; i++) {
        starMap.push(i);
    }
    const handleSelection = (starNumber) => {
        return () => {
            handleRating(starNumber);
            setLocalRating(starNumber);
        }
    }
    return (
        <div className={style.ratingStars}>
            {starMap.map((star) => (
                <button
                    type="button"
                    key={star}
                    onClick={handleSelection(star)}
                    className={star<=localRating?style.shadedStars:""}
                >
                    <FiStar />
                </button>
            ))}
        </div>
    )
}