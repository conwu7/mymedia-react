import { MdRadioButtonUnchecked } from 'react-icons/md';
import style from '../stylesheets/components/list-selector.module.scss';

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
                <div>
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
                </div>
            }
            {
                showTv &&
                    <div>
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