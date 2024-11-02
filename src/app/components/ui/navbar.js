"use client";

import {useEffect, useRef, useState} from "react";
import styles from "@/app/components/ui/navbar.module.css";

import {useRouter, usePathname} from "next/navigation";
import LordIcon from "@/app/components/ui/lordIcon";
import {logout} from "@/app/controller/userController";

export default function Navbar() {
    const router = useRouter();
    const pathname = usePathname();
    const [deploy, setDeploy] = useState(false);
    const homeIconRef = useRef(null);
    const ticketIconRef = useRef(null);
    const settingsIconRef = useRef(null);
    const logoutIconRef = useRef(null);

    const logoutBtn = async () => {
        logout().then(() => {
            router.push('/');
        })
    }

    if (pathname.startsWith("/home/watch")) {
        return null;
    }

    return (
        <nav>


                    <div className={`${styles.nav} ${deploy ? styles.deploy : ''}`}
                         onMouseEnter={() => {
                             if (!deploy) setDeploy(true)
                         }}
                    onMouseLeave={() => {
                        if (deploy) setDeploy(false)
                    }}>
                        <div onClick={() => router.push("/home")} className={`${styles.navElem} ${pathname === "/home" ? styles.selected : ""}`} onMouseEnter={() => {if (homeIconRef) homeIconRef.current.triggerAnimation()}}>
                            <p>Accueil</p>
                            <LordIcon ref={homeIconRef} iconName={"home-white"} animationType={"hover"}/>
                        </div>
                        <div onClick={() => router.push("/home/search")} className={`${styles.navElem} ${pathname === "/home/search" ? styles.selected : ""}`} onMouseEnter={() => {if (ticketIconRef) ticketIconRef.current.triggerAnimation()}}>
                            <p>Rechercher</p>
                            <LordIcon ref={ticketIconRef} iconName={"search-white"} animationType={"hover"}/>
                        </div>
                        <div className={`${styles.elemBottom} ${styles.navElem} ${pathname === "/aaa" ? styles.selected : ""}`} onMouseEnter={() => {if (settingsIconRef) settingsIconRef.current.triggerAnimation()}}>
                            <p>Paramètres</p>
                            <LordIcon ref={settingsIconRef} iconName={"settings-white"} animationType={"hover"}/>
                        </div>
                        <div className={`${styles.navElem} ${pathname === "/aaa" ? styles.selected : ""}`} onClick={logoutBtn} onMouseEnter={() => {if (logoutIconRef) logoutIconRef.current.triggerAnimation()}}>
                            <p>Déconnexion</p>
                            <LordIcon ref={logoutIconRef} iconName={"cross-white"} animationType={"hover"}/>
                        </div>

                    </div>



        </nav>
    )
}