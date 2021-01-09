import { useFormik } from "formik";
import { putOrPostToApi } from "../helpers/common";
import style from '../stylesheets/components/edit-user-media.module.scss';
import searchStyle from '../stylesheets/components/search.module.scss';
import defaultPoster from '../images/default-poster.png';
import { CollapsibleCard, SubmitButton } from "./common";
import { FiCheckCircle, FiXCircle, FiStar } from 'react-icons/fi';
import React, { useState } from "react";
import { UserMediaSchema } from '../helpers/validation';
import WaitForServer from "./wait-for-server";

export default function EditUserMedia (props) {
    const {userMedia, listCategory, handleActivityClose, refreshList} = props;
    const [wait, setWaitForServer] = useState(false);
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
            if (
                values.toWatchNotes === userMedia.toWatchNotes &&
                values.isWatched === userMedia.isWatched &&
                values.userRating === userMedia.userRating &&
                values.reviewNotes === userMedia.reviewNotes &&
                values.streamingSource === userMedia.streamingSource
            ) {
                return handleActivityClose();
            }
            setWaitForServer(true);
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
            } finally {
                setWaitForServer(false);
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
            <WaitForServer
                wait={wait}
                waitText="Saving your changes"
            />
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
                            <option value="HBO MAX"/>
                            <option value="AMAZON"/>
                            <option value="DISNEY+"/>
                            <option value="APPLE TV+"/>
                            <option value="HULU"/>
                            <option value="PEACOCK"/>
                            <option value="CBS"/>
                            <option value="SHOWTIME"/>
                            <option value="STARZ"/>
                            <option value="BUY/RENT"/>
                        </datalist>
                    </fieldset>
                    <div className="errorDiv">
                        {
                            formik.errors.streamingSource &&
                            `${formik.errors.streamingSource} (Currently ${formik.values.streamingSource.length})`
                        }
                    </div>
                    <UserMediaTextFields
                        formik={formik}
                        fieldName="toWatchNotes"
                        fieldText="Watch Notes"
                    />
                    <div className={style.fieldContainer}>
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
                    <SubmitButton text="Save" />
                </form>
            </section>
        </div>
    )
}
function UserMediaTextFields (props) {
    const {formik, fieldName, fieldText} = props;
    return (
        <div className={`${style[fieldName]} ${style.fieldContainer}`}>
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
                {
                    formik.errors[fieldName] &&
                    `${formik.errors[fieldName]} (Currently ${formik.values[fieldName].length})`
                }
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