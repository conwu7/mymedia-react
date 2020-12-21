import { Link } from 'react-router-dom';

import style from '../stylesheets/components/navbar.module.scss';

import { postToApi } from '../helpers/common';
import { CollapsibleCard } from '../components/common';

import { HiMenu } from 'react-icons/hi';

export function NavBar () {
    const handleLogout = async (e) => {
        if (!window.confirm("Are you sure you want to logout?")) return
        const response = await postToApi({}, '/api/logout');
        if (response.success) {alert("Logout successful"); window.location.reload();}
        if (response.err) alert(response.err);
    }
    return (
        <div>
            <ul className={style.navbar}>
                <li><Link to="/">MyMedia.App</Link></li>
                <li className={style.menu}>
                    <CollapsibleCard 
                        collapseButton={<HiMenu />}
                        skipAllStyling={true}
                        isCollapsed={true}
                        hideOnFocusLost={true}
                    >
                        <div className={style.menuItemsContainer}>
                            <Link to="/myaccount">Settings</Link>
                            <br />
                            <button onClick={handleLogout}>Logout</button>
                        </div>
                    </CollapsibleCard>
                </li>
            </ul>
            <div style={{height: "48px"}}></div>
        </div>
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