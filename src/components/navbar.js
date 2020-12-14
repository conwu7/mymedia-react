import {Link} from 'react-router-dom';

import style from '../stylesheets/components/navbar.module.scss';

import {postToApi} from '../helpers/common';

export function NavBar () {
    const handleLogout = async (e) => {
        if (!window.confirm("Are you sure you want to logout?")) return
        const response = await postToApi({}, '/api/logout');
        if (response.success) {alert("Logout successful"); window.location.reload();}
        if (response.err) alert(response.err);
    }
    return (
        <ul className={style.navbar}>
            <li><Link to="/">DASHBOARD</Link></li>
            <li><Link to="myaccount">ACCOUNT</Link></li>
            <li><button onClick={handleLogout}>LOGOUT</button></li>
        </ul>
    )
}

export function NavBarNoUser () {
    return (
        <ul className={style.navbar}>
            <li><Link to="/signup">SIGN UP</Link></li>
            <li><Link to="/login">LOGIN</Link></li>
        </ul>
    )
}