import { Link } from 'react-router-dom';

import style from '../stylesheets/components/navbar.module.scss';

export function NavBar () {
    return (
        <div className={style.navbarContainer}>
            <ul className={style.navbarList}>
                <li className={`${style.navbarItem} ${style.appName}`}>
                    <a href="/">MyMediaLists</a>
                </li>
            </ul>
        </div>
    )
}

export function NavBarNoUser () {
    return (
        <div className={style.navbarContainer}>
            <ul className={style.navbarList}>
                <li className={style.navbarItem}><Link to="/signup">SIGN UP</Link></li>
                <li className={style.navbarItem}><Link to="/login">LOGIN</Link></li>
            </ul>
        </div>
    )
}