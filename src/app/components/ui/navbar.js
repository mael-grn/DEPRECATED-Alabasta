"use client";

import {useEffect, useMemo, useRef, useState} from "react";
import styles from "@/app/components/ui/navbar.module.css";

import {useRouter, usePathname} from "next/navigation";
import LordIcon from "@/app/components/ui/lordIcon";
import {logout} from "@/app/controller/userController";

export default function Navbar() {
    const router = useRouter();
    const pathname = usePathname();
    const [deploy, setDeploy] = useState(false);
    const homeIconRef = useRef(null);
    const searchIconRef = useRef(null);
    const settingsIconRef = useRef(null);
    const logoutIconRef = useRef(null);

    const activeRoute = useMemo(() => {
        if (pathname === "/home") return "home";
        if (pathname === "/search") return "search";
        if (pathname === "/user") return "user";
        return "";
    }, [pathname]);

    if (pathname.startsWith("/watch") || pathname === "/") {
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
                <div onClick={() => router.push("/home")}
                     className={`${styles.navElem} ${activeRoute === "home" ? styles.selected : ''}`}
                     onMouseEnter={() => {
                         if (homeIconRef) homeIconRef.current.triggerAnimation()
                     }}>
                    <p>Accueil</p>
                    <LordIcon ref={homeIconRef} iconName={"home-white"} animationType={"hover"}/>
                </div>
                <div onClick={() => router.push("/search")}
                     className={`${styles.navElem} ${activeRoute === "search" ? styles.selected : ''}`}
                     onMouseEnter={() => {
                         if (searchIconRef) searchIconRef.current.triggerAnimation()
                     }}>
                    <p>Rechercher</p>
                    <LordIcon ref={searchIconRef} iconName={"search-white"} animationType={"hover"}/>
                </div>
                <div onClick={() => router.push("/user")}
                     className={`${styles.navElem} ${activeRoute === "user" ? styles.selected : ''}`}
                     onMouseEnter={() => {
                         if (searchIconRef) searchIconRef.current.triggerAnimation()
                     }}>
                    <p>Profile</p>
                    <LordIcon ref={searchIconRef} iconName={"account-white"} animationType={"hover"}/>
                </div>
            </div>


        </nav>
    )
}