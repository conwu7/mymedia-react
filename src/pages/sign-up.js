import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { useFormik } from 'formik';
import style from '../stylesheets/pages/sign-up.module.scss';
import { putOrPostToApi } from '../helpers/common';
import { SignUpSchema } from "../helpers/validation";
import WaitForServer from "../components/wait-for-server";
import {SubmitButton} from "../components/common";

export default function SignUpForm (props) {
    const [wait, setWaitForServer] = useState(false);
    const [serverError, setServerError] = useState("");
    const formik = useFormik({
        initialValues: {
            username: '',
            email: '', 
            password: '',
        },
        validationSchema: SignUpSchema,
        onSubmit: values => {
            setWaitForServer(true);
            setServerError("");
            setTimeout(async ()=>{
                try {
                    await putOrPostToApi(values, 'signup', 'post');
                    window.location.reload()
                } catch (err) {
                    setServerError(err);
                } finally {
                    setWaitForServer(false);
                }
            }, 1500);
        }
    });
    if (props.user) return <Redirect to="/" />;
    return (
        <div className={style.signUpPage}>
            <WaitForServer
                wait={wait}
                waitText="Creating your new account"
            />
            <form onSubmit={formik.handleSubmit} className={style.signUpForm}>
                <fieldset>
                    <label htmlFor="username">Username</label>
                    <input
                        id="username"
                        name="username"
                        type="text"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.username}
                    />
                    <div className="errorDiv">
                        {formik.touched.username && formik.errors.username}
                    </div>
                </fieldset>
                <fieldset>
                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.email}
                    />
                    <div className="errorDiv">
                        {formik.touched.email && formik.errors.email}
                    </div>
                </fieldset>
                <fieldset>
                    <label htmlFor="password">Password</label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.password}
                    />
                    <div className="errorDiv">
                        {formik.touched.password && formik.errors.password}
                    </div>
                </fieldset>
                <SubmitButton
                    text={wait? "Creating your account" : "Submit"}
                    disabled={wait}
                />
                <div className="errorDiv">{serverError}</div>
            </form>
        </div>
    );
}

