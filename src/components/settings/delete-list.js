import style from "../../stylesheets/pages/settings.module.scss";
import { fetchOrDeleteFromApi} from "../../helpers/common";
import ListSelector from "../list-selector";
import { RiDeleteBin2Line } from 'react-icons/ri';
import { useState } from 'react';
import WaitForServer from "../wait-for-server";

export default function DeleteList (props) {
    const {refreshList, tvListNames, movieListNames} = props;
    const [wait, setWaitForServer] = useState(false);
    const handleDeleteList = async (listCategory, listName, listID) => {
        if (!window.confirm(`Are you sure you want to delete '${listName}' list?`)) return
        setWaitForServer(true);
        try {
            await fetchOrDeleteFromApi(`lists/${listCategory}/${listID}`, 'delete');
            // handleActivityClose();
            refreshList(listCategory)
        } catch (err) {
            window.alert('Unsuccessful - ' + err);
        } finally {
            setWaitForServer(false);
        }
    }
    // after a click from the list selector component
    const handleSelection = (list, listCategory) => {
        handleDeleteList(listCategory, list.name, list._id)
            .catch(err => console.log(err));
    }
    return (
        <div
            className={style.deleteContainer}
        >
            <ListSelector
                showTv={true}
                showMovies={true}
                actionIcon={<RiDeleteBin2Line />}
                handleSelection={handleSelection}
                tvListNames={tvListNames.toWatchListsTv}
                movieListNames={movieListNames.toWatchLists}
            />
            <WaitForServer
                wait={wait}
                waitText="Deleting List"
            />
        </div>
    )
}