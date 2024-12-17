"use client";

import {useEffect, useMemo, useRef, useState} from "react";
import styles from "@/app/components/ui/navbar.module.css";

import {useRouter, usePathname} from "next/navigation";
import LordIcon from "@/app/components/ui/lordIcon";
import {logout} from "@/app/controller/userController";

export default function Navbar() {
    const router = useRouter();
    const pathname = usePathname();
    const homeIconRef = useRef(null);
    const searchIconRef = useRef(null);
    const settingsIconRef = useRef(null);
    const userIconRef = useRef(null);

    const routes = {
        home: "/home",
        search: "/search",
        user: "/user",
        settings: "/settings"
    }


    if (pathname.startsWith("/watch") || pathname === "/") {
        return null;
    }

    return (
        <nav>
            <div className={`${styles.nav}`}>

                <div onClick={() => router.push(routes.home)}
                     className={`${styles.navElem} ${pathname === routes.home && styles.selected}`}
                     onMouseEnter={() => {
                         if (homeIconRef) homeIconRef.current.triggerAnimation()
                     }}>
                    <LordIcon ref={homeIconRef} iconName={"home-white"} animationType={"hover"}/>
                </div>

                <div onClick={() => router.push(routes.search)}
                     className={`${styles.navElem} ${pathname === routes.search && styles.selected}`}
                     onMouseEnter={() => {
                         if (searchIconRef) searchIconRef.current.triggerAnimation()
                     }}>
                    <LordIcon ref={searchIconRef} iconName={"search-white"} animationType={"hover"}/>
                </div>

                <div onClick={() => router.push(routes.user)}
                     className={`${styles.navElem} ${pathname === routes.user && styles.selected}`}
                     onMouseEnter={() => {
                         if (userIconRef) userIconRef.current.triggerAnimation()
                     }}>
                    <LordIcon ref={userIconRef} iconName={"account-white"} animationType={"hover"}/>
                </div>

                <div onClick={() => router.push(routes.settings)}
                     className={`${styles.navElem} ${pathname === routes.settings && styles.selected}`}
                     onMouseEnter={() => {
                         if (settingsIconRef) settingsIconRef.current.triggerAnimation()
                     }}>
                    <LordIcon ref={settingsIconRef} iconName={"settings-white"} animationType={"hover"}/>
                </div>

            </div>


        </nav>
    )
}