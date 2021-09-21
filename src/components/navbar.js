import { Link } from "react-router-dom"

import style from "../stylesheets/components/navbar.module.scss"

export function NavBar() {
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

export function NavBarNoUser() {
   return (
      <div className={style.navbarContainer}>
         <ul className={style.navbarList}>
            <li className={`${style.navbarItem} ${style.appName}`}>
               <a href="/">MyMediaLists</a>
            </li>
            <ul className={style.otherLinksContainer}>
               <li className={style.navbarItem}>
                  <Link to="/signup">SIGNUP</Link>
               </li>
               <li className={style.navbarItem}>/</li>
               <li className={style.navbarItem}>
                  <Link to="/login">LOGIN</Link>
               </li>
            </ul>
         </ul>
      </div>
   )
}
