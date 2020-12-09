import React, {useState} from 'react';
import {Redirect} from 'react-router-dom';
import {useFormik} from 'formik';
import style from '../stylesheets/pages/sign-up.module.scss';
import {postToApi} from '../helpers/common';

export default function SignUpForm (props) {
    const [isFormSubmitted, setFormSubmitted] = useState(false);
    const [serverError, setServerError] = useState("");
    const [redirect, setRedirect] = useState(false);
    const formik = useFormik({
        initialValues: {
            username: '',
            email: '', 
            password: '',
        },
        onSubmit: async values => {
            if (isFormSubmitted) return;
            setFormSubmitted(true);
            const response = await postToApi(values, '/api/signup');
            if (response.success) return window.location.reload();
            if (response.err) {
                setServerError(response.err);
                setFormSubmitted(false);
            }
        }
    });
    return (
        <div className={style.signUpPage}>
            {props.user? <Redirect to="/" /> : null}
            <form onSubmit={formik.handleSubmit} className={style.signUpForm}>
                <h1>SIGN UP FORM</h1>
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
                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        onChange={formik.handleChange}
                        value={formik.values.email}
                    />
                </fieldset>
                <div>{formik.errors.email}</div>
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

