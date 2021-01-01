import { Link } from 'react-router-dom';
import React from "react";

import style from '../stylesheets/components/navbar.module.scss';

export function NavBar () {
    return (
        <div className={style.navbar}>
            <ul>
                <li className={style.appName}><Link to="/">MyMedia.App</Link></li>
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