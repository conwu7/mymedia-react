import { Link } from 'react-router-dom';

import style from '../stylesheets/components/navbar.module.scss';

export function NavBar () {
    return (
        <div className={style.navbar}>
            <ul>
                <li className={style.appName}>
                    <a href="/">MyMediaLists.App</a>
                </li>
            </ul>
        </div>
    )
}

export function NavBarNoUser () {
    return (
        <div className={style.navbar}>
            <ul>
                <li><Link to="/signup">SIGN UP</Link></li>
                <li><Link to="/login">LOGIN</Link></li>
            </ul>
        </div>
    )
}