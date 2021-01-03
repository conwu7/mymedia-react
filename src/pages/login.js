import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { useFormik } from 'formik';
import style from '../stylesheets/pages/sign-up.module.scss';
import { putOrPostToApi } from '../helpers/common';
import { LoginSchema } from '../helpers/validation'

export default function LoginForm (props) {
    const [isFormSubmitted, setFormSubmitted] = useState(false);
    const [serverError, setServerError] = useState("");
    const formik = useFormik({
        initialValues: {
            username: '',
            password: '',
        },
        validationSchema: LoginSchema,
        onSubmit: values => {
            if (isFormSubmitted) return;
            setFormSubmitted(true);
            setServerError("");
            setTimeout(async ()=>{
                try {
                    await putOrPostToApi(values, "login", 'post');
                    window.location.reload()
                } catch (err) {
                    setServerError(err);
                } finally {
                    setFormSubmitted(false);
                }
            }, 1500);
        }
    });
    if (props.user) return <Redirect to="/" />;
    return (
        <div className={style.signUpPage}>
            <form onSubmit={formik.handleSubmit} className={style.signUpForm}>
                <fieldset>
                    <label htmlFor="username">Username</label>
                    <input
                        id="username"
                        name="username"
                        type="text"
                        onChange={formik.handleChange}
                        value={formik.values.username}
                    />
                    <div className="errorDiv">{formik.errors.username}</div>
                </fieldset>

                <fieldset>
                    <label htmlFor="password">Password</label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        onChange={formik.handleChange}
                        value={formik.values.password}
                    />
                </fieldset>
                <button
                    type="submit"
                    disabled={isFormSubmitted}
                >
                    {isFormSubmitted? "Submitting" : "Submit"}
                </button>
                <div className="errorDiv">{serverError}</div>
            </form>
        </div>
    );
}

