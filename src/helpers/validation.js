import * as Yup from "yup"

// Signup - username, email, password
// Login - username, password
// New list - listName, listDescription
// Edit List - listName, listDescription
// User Media - toWatchNotes, reviewNotes
// Search - toWatch Notes

export const SignUpSchema = Yup.object().shape({
   username: Yup.string()
      .min(3, "Too Short - Min 6 characters")
      .max(20, "Too Long - Max 20 characters")
      .required("Required")
      .matches(/^[a-z0-9]+$/i, "Must be Alphanumeric")
      .lowercase(),
   email: Yup.string().email("Invalid email").required("Required"),
   password: Yup.string()
      .min(6, "Too Short - Min 6 characters")
      .max(128, "Too Long - Max 128 characters")
      .required("Required")
})

export const LoginSchema = Yup.object().shape({
   username: Yup.string()
      .min(3, "Invalid Username")
      .required("Required")
      .lowercase()
})

export const ListSchema = Yup.object().shape({
   listName: Yup.string()
      .min(2, "Too Short - Min 2 characters")
      .max(40, "Too Long - Max 40 characters")
      .required("Required"),
   description: Yup.string().max(140, "Too Long - Max 140 characters"),
   typeOfList: Yup.string().required("Required")
})

export const UserMediaSchema = Yup.object().shape({
   toWatchNotes: Yup.string().max(200, "Too Long - Max 200 characters"),
   reviewNotes: Yup.string().max(200, "Too Long - Max 200 characters"),
   streamingSource: Yup.string()
      .required()
      .max(20, "Too Long - Max 20 characters")
})

export const SearchSchema = Yup.object().shape({
   searchString: Yup.string()
      .min(4, "Search with at least 4 characters")
      .required("Required")
      .test(
         "firstCharacter",
         "First character must be alphanumeric",
         (value) => {
            // true means valid here
            if (!value) return true
            if (!isNaN(value[0])) return true
            return value[0].toUpperCase() !== value[0].toLowerCase()
         }
      )
})

export const StreamingSchema = Yup.object().shape({
   streamingSource: Yup.string()
      .required()
      .max(20, "Too Long - Max 20 characters")
})

export const FeedbackSchema = Yup.object().shape({
   feedbackType: Yup.string().required("Required"),
   feedbackMessage: Yup.string()
      .required("Required")
      .max(500, "Too Long - Max 500 characters")
})
