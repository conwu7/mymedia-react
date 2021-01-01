import React, {useState} from 'react';
import {Redirect} from 'react-router-dom';
import {useFormik} from 'formik';
import style from '../stylesheets/pages/sign-up.module.scss';
import {putOrPostToApi} from '../helpers/common';

export default function LoginForm (props) {
    const [isFormSubmitted, setFormSubmitted] = useState(false);
    const [serverError, setServerError] = useState("");
    const formik = useFormik({
        initialValues: {
            username: '',
            password: '',
        },
        onSubmit: async values => {
            try {
                if (isFormSubmitted) return;
                setFormSubmitted(true);
                const response = await putOrPostToApi(values, "login", 'post');
                window.location.reload()
            } catch (err) {
                setServerError(err);
                setFormSubmitted(false);
            }
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
                </fieldset>
                <div>{formik.errors.username}</div>
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
                <div>{formik.errors.password}</div>
                <button type="submit">Submit</button>
                <div>{serverError}</div>
            </form>
        </div>
    );
}

