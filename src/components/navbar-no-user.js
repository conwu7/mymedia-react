import {Link} from 'react-router-dom';
import style from '../stylesheets/components/navbar.module.scss';

export default function NavBarNoUser () {
    return (
        <ul className={style.navbar}>
            <li><Link to="/signup">SIGN UP</Link></li>
            <li><Link to="/login">LOGIN</Link></li>
        </ul>
    )
}