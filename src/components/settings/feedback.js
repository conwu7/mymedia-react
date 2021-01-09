import React, { useState } from 'react';
import { useFormik } from "formik";
import { putOrPostToApi } from "../../helpers/common";
import WaitForServer from "../wait-for-server";
import style from "../../stylesheets/pages/settings.module.scss";
import { FeedbackSchema } from '../../helpers/validation';
import {SubmitButton} from "../common";

export function Feedback (props) {
    const {handleActivityClose} = props;
    const [wait, setWaitForServer] = useState(false);
    const formik = useFormik({
        initialValues: {
            feedbackType: "selectOne",
            feedbackMessage: "",
        },
        validate: (values) => (
            (values.feedbackType === "selectOne") ? {feedbackType: 'Required'} : undefined
        ),
        validationSchema: FeedbackSchema,
        onSubmit: async values => {
            setWaitForServer(true);
            try {
                await putOrPostToApi(
                    values,
                    'feedback',
                    'post'
                );
                handleActivityClose();
            } catch (err) {
                window.alert(`Unsuccessful - ${err}`)
            } finally {
                setWaitForServer(false);
            }
        }
    });
    return (
        <>
            <form
                onSubmit={formik.handleSubmit}
                className={style.newListForm}
            >
                <fieldset><label htmlFor="feedbackType">Feedback Type</label>
                    <select
                        name="feedbackType"
                        id="feedbackType"
                        onChange={formik.handleChange}
                        value={formik.values.feedbackType}
                    >
                        <option value="selectOne" disabled={true}>Select a type</option>
                        <option value="bugs">Bugs</option>
                        <option value="featureRequest">Feature Request</option>
                        <option value="generalFeedback">General Feedback</option>
                    </select>
                </fieldset>
                <div className="errorDiv">
                    {formik.touched.feedbackType && formik.errors.feedbackType}
                </div>
                <fieldset>
                    <label htmlFor="feedbackMessage">Message</label>
                    <textarea
                        name="feedbackMessage"
                        id="feedbackMessage"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.feedbackMessage}
                    />
                </fieldset>
                <div className="errorDiv">
                    {
                        formik.errors.feedbackMessage &&
                        `${formik.errors.feedbackMessage} (Currently ${formik.values.feedbackMessage.length})`
                    }
                </div>
                <fieldset>
                    <SubmitButton />
                </fieldset>
            </form>
            <WaitForServer
                wait={wait}
                waitText="Sending your feedback"
            />
        </>
    )
}