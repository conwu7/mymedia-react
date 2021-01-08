import { MdRadioButtonUnchecked } from 'react-icons/md';
import style from '../stylesheets/components/list-selector.module.scss';
import listStyle from '../stylesheets/components/list-button.module.scss';

// component that shows you lists provided and executes
// the handleSelection function after clicking on one of them
export default function ListSelector (props) {
    const {showTv, showMovies, handleSelection, actionIcon,
            tvListNames, movieListNames} = props;
    const icon = actionIcon ? actionIcon : <MdRadioButtonUnchecked />;
    const handleClick = (list, listCategory) => {
        return (() => {handleSelection(list, listCategory)})
    }
    return (
        <section>
            {
                showMovies &&
                <div className={listStyle.container}>
                    <p className={style.listCategory}>MOVIES</p>
                    {movieListNames.map(list => (
                        <button
                            key={list._id}
                            type="button"
                            onClick={handleClick(list, 'towatch')}
                            className={style.listButton}
                        >
                            <span>{list.name}</span>
                            {icon}
                        </button>
                    ))}
                    {movieListNames.length === 0? "-": undefined}
                </div>
            }
            {
                showTv &&
                    <div className={listStyle.container}>
                        <p className={style.listCategory}>TV SHOWS</p>
                        {tvListNames.map(list => (
                            <button
                                key={list._id}
                                type="button"
                                onClick={handleClick(list, 'towatchtv')}
                                className={style.listButton}
                            >
                                <span>{list.name}</span>
                                {icon}
                            </button>
                        ))}
                        {tvListNames.length === 0? "-": undefined}
                    </div>
            }

        </section>
    )
}