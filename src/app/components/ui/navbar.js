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
                     className={`${styles.navElem}`}
                     onMouseEnter={() => {
                         if (homeIconRef) homeIconRef.current.triggerAnimation()
                     }}>
                    <LordIcon ref={homeIconRef} iconName={pathname === routes.home ? "home-red-full" : "home-white"} animationType={"hover"}/>
                </div>

                <div onClick={() => router.push(routes.search)}
                     className={`${styles.navElem}`}
                     onMouseEnter={() => {
                         if (searchIconRef) searchIconRef.current.triggerAnimation()
                     }}>
                    <LordIcon ref={searchIconRef} iconName={pathname === routes.search ? "search-red-full" : "search-white"} animationType={"hover"}/>
                </div>

                <div onClick={() => router.push(routes.user)}
                     className={`${styles.navElem}`}
                     onMouseEnter={() => {
                         if (userIconRef) userIconRef.current.triggerAnimation()
                     }}>
                    <LordIcon ref={userIconRef} iconName={pathname === routes.user ? "account-red-full" : "account-white"} animationType={"hover"}/>
                </div>

                <div onClick={() => router.push(routes.settings)}
                     className={`${styles.navElem}`}
                     onMouseEnter={() => {
                         if (settingsIconRef) settingsIconRef.current.triggerAnimation()
                     }}>
                    <LordIcon ref={settingsIconRef} iconName={pathname === routes.settings ? "settings-red-full" : "settings-white"} animationType={"hover"}/>
                </div>

            </div>


        </nav>
    )
}