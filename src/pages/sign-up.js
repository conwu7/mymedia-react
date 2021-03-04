import {SignUpSchema} from "../helpers/validation";
import {FormBody} from "./login";

export default function SignUpForm (props) {
    return (
        <FormBody
            user={props.user}
            page="Sign Up"
            isCreating={true}
            showEmail={true}
            apiUrl="signup"
            validationSchema={SignUpSchema}
        />
    )
}