import style from "../../stylesheets/pages/settings.module.scss";
import { fetchOrDeleteFromApi} from "../../helpers/common";
import ListSelector from "../list-selector";
import { RiDeleteBin2Line } from 'react-icons/ri';
import { useState } from 'react';
import WaitForServer from "../wait-for-server";

export default function DeleteList (props) {
    const [wait, setWaitForServer] = useState(false);
    const {refreshList, tvListNames, movieListNames} = props;
    const {toWatchListsTv} = tvListNames;
    const {toWatchLists} = movieListNames;
    const handleDeleteList = async (listCategory, listName, listID) => {
        if (!window.confirm(`Are you sure you want to delete '${listName}' list?`)) return
        setWaitForServer(true);
        try {
            await fetchOrDeleteFromApi(`lists/${listCategory}/${listID}`, 'delete');
            // handleActivityClose();
            refreshList(listCategory)
        } catch (err) {
            if (err === 'not-found') refreshList(listCategory);
            window.alert('Unsuccessful - List could have been deleted on a different device');
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
                tvListNames={toWatchListsTv}
                movieListNames={toWatchLists}
            />
            <WaitForServer
                wait={wait}
                waitText="Deleting List"
            />
        </div>
    )
}