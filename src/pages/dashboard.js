
import ListTypesContainer from '../components/list-types-container';

export default function Dashboard (props) {
    if (!props.user) return (<h1>Sign up or login to use this website</h1>)
    return (
        <div>
            <ListTypesSelector />
            <ListTypesContainer />
        </div>
    )
}

function ListTypesSelector (props) {
    return null;
}