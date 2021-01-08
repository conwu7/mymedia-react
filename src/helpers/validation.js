import * as Yup from 'yup';

// Signup - username, email, password
// Login - username, password
// New list - listName, listDescription
// Edit List - listName, listDescription
// User Media - toWatchNotes, reviewNotes
// Search - toWatch Notes


export const SignUpSchema = Yup.object().shape({
    username: Yup.string()
        .min(3, 'Too Short - Min 6 characters')
        .max(20, 'Too Long - Max 20 characters')
        .required('Required')
        .matches(/^[a-z0-9]+$/i, 'Must be Alphanumeric')
        .lowercase(),
    email: Yup.string()
        .email('Invalid email')
        .required('Required'),
    password: Yup.string()
        .min(6, 'Too Short - Min 6 characters')
        .max(128, 'Too Long - Max 128 characters')
        .required('Required')
});

export const LoginSchema = Yup.object().shape({
    username: Yup.string()
        .min(3, 'Invalid Username')
        .required('Required')
        .lowercase()
});

export const ListSchema = Yup.object().shape({
    listName: Yup.string()
        .min(2, 'Too Short - Min 2 characters')
        .max(20, 'Too Long - Max 20 characters')
        .required('Required'),
    description: Yup.string()
        .max(140, 'Too Long - Max 140 characters'),
    typeOfList: Yup.string()
        .required('Required')
});

export const UserMediaSchema = Yup.object().shape({
    toWatchNotes: Yup.string().max(200, 'Too Long - Max 200 characters'),
    reviewNotes: Yup.string().max(200, 'Too Long - Max 200 characters')
});

export const SearchSchema = Yup.object().shape({
    searchString: Yup.string()
        .min(4, 'Search with at least 4 characters')
        .required('Required')
});

export const StreamingSchema = Yup.object().shape({
    streamingSource: Yup.string().uppercase()
})