import React, { useState } from 'react';
import { Redirect, Link as RouterLink } from 'react-router-dom';
import { useFormik } from 'formik';
import { LoginSchema } from '../helpers/validation'
import WaitForServer from "../components/wait-for-server";

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import {basicFetch} from "../helpers/common";

export default function LoginForm(props) {
    return (
        <FormBody
            user={props.user}
            page="Log in"
            isCreating={false}
            showEmail={false}
            apiUrl="login"
            validationSchema={LoginSchema}
        />
    )
}

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: "darkslategray",
    },
    formContainer: {
        minHeight: "85vh",
        '& *': {
            fontFamily: "QuickSand, sans-serif"
        }
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
        '& input': {
            backgroundColor: "white"
        }
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
        backgroundColor: "darkslategray",
        color: "white",
        fontWeight: "bold",
        fontSize: 18
    },
    error: {
        color: 'red',
        fontSize: '1.2em',
        margin: "auto",
        textAlign: "center"
    }
}));

export function FormBody (props) {
    const styles = useStyles();
    const {user, showEmail, page, isCreating, apiUrl, validationSchema} = props;
    const [wait, setWaitForServer] = useState(false);
    const [serverError, setServerError] = useState("");
    const initialValues = {
        username: '',
        email: showEmail? '' : undefined,
        password: ''
    }
    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: values => {
            setServerError("");
            const onSuccess = () => window.location.reload();
            basicFetch(
                `${apiUrl}`,
                'post',
                values,
                setWaitForServer,
                onSuccess,
                setServerError
            );
        }
    });
    if (user) return <Redirect to="/" />;
    return (
        <>
            <Container component="main"
                       maxWidth="xs"
                       className={styles.formContainer}
            >
                <WaitForServer wait={wait}
                               waitText="Authenticating"
                />
                <CssBaseline />
                <div className={styles.paper}>
                    <Avatar className={styles.avatar}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        {page}
                    </Typography>
                    <form className={styles.form} onSubmit={formik.handleSubmit}>
                        <Grid container spacing={2}>
                            {   showEmail &&
                            <>
                                <Grid item xs={12}>
                                    <Grid item xs={12}>
                                        <TextField
                                            variant="outlined"
                                            required
                                            fullWidth
                                            id="email"
                                            label="Email Address"
                                            name="email"
                                            autoComplete="email"
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            value={formik.values.email}
                                        />
                                    </Grid>
                                </Grid>
                                <Grid item className={styles.error}>
                                    {formik.touched.email && formik.errors.email}
                                </Grid>
                            </>

                            }
                            <Grid item xs={12}>
                                <TextField
                                    variant="outlined"
                                    required
                                    fullWidth
                                    id="username"
                                    label="Username"
                                    name="username"
                                    autoComplete="username"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.username}
                                />
                            </Grid>
                            <Grid item className={styles.error}>
                                {formik.touched.username && formik.errors.username}
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    variant="outlined"
                                    required
                                    fullWidth
                                    name="password"
                                    label="Password"
                                    type="password"
                                    id="password"
                                    autoComplete="current-password"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.password}
                                />
                            </Grid>
                            <Grid item className={styles.error}>
                                {formik.touched.password && formik.errors.password}
                            </Grid>
                        </Grid>
                        <Grid item className={styles.error}>
                            {serverError}
                        </Grid>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            className={styles.submit}
                        >
                            {page}
                        </Button>
                        <Grid container justify="flex-end">
                            {
                                isCreating ?
                                    <Grid item>
                                        <RouterLink to={{pathname: "/login", state: {prevPage: window.location.href}}}>
                                            Already have an account? Log in
                                        </RouterLink>
                                    </Grid> :
                                    <Grid item>
                                        <RouterLink to={{pathname: "/signup", state: {prevPage: window.location.href}}}>
                                            Don't have an account? Sign Up
                                        </RouterLink>
                                    </Grid>
                            }
                        </Grid>
                    </form>
                </div>
            </Container>
        </>
    )
}
