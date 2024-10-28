"use client";

import {useEffect, useRef, useState} from "react";
import styles from "@/app/components/navbar.module.css";
import Link from "next/link";

import Image from "next/image";

import {logout} from "@/app/utils/queryUtils";
import {useRouter} from "next/navigation";
import {authenticateUser, recoverUserData} from "@/app/controller/userController";
import LordIcon from "@/app/components/lordIcon";

export default function Navbar() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [bgClosing, setBgClosing] = useState(false);
    const [deploy, setDeploy] = useState(false);
    const accountIconRef = useRef(null);
    const homeIconRef = useRef(null);
    const ticketIconRef = useRef(null);
    const settingsIconRef = useRef(null);
    const logoutIconRef = useRef(null);

    const handleUserUpdate = () => {
        setLoading(true);
        authenticateUser().then((res) => {
            if (res) {
                recoverUserData().then(user => {
                    if (!user) {
                        setLoading(true);
                        setUser(false);
                    } else {
                        setLoading(false);
                        setUser(user);
                    }
                });
            } else {
                setLoading(false);
            }
        });
    };

    useEffect( () => {
        handleUserUpdate();

        // Écoute l'événement personnalisé
        window.addEventListener('userUpdate', handleUserUpdate);

        // Nettoyer l'écouteur lors du démontage du composant
        return () => {
            window.removeEventListener('userUpdate', handleUserUpdate);
        };
    }, []);



    const logoutBtn = async () => {
        logout().then(() => {
            closeShowUserData()
            setUser(null)
            router.push('/');
        })
    }

    const closeShowUserData = () => {
        setBgClosing(true);
        setDeploy(false);
        setTimeout(() => {
            setBgClosing(false);
        }, 400);

    }

    return (
        <nav>
            {
                !loading ?
                    <div className={`${styles.nav} ${deploy ? styles.deploy : ''}`}
                         onMouseEnter={() => {
                             if (!deploy) setDeploy(true)
                         }}
                    onMouseLeave={() => {
                        if (deploy) setDeploy(false)
                    }}>

                        <div className={styles.navElem} onMouseEnter={() => {if (accountIconRef) accountIconRef.current.triggerAnimation()}}>
                            <p>{user.name}</p>
                            <LordIcon ref={accountIconRef} iconName={"account-white"} animationType={"hover"}/>
                        </div>
                        <div className={styles.navElem} onMouseEnter={() => {if (homeIconRef) homeIconRef.current.triggerAnimation()}}>
                            <p>Accueil</p>
                            <LordIcon ref={homeIconRef} iconName={"home-white"} animationType={"hover"}/>
                        </div>
                        <div className={styles.navElem} onMouseEnter={() => {if (ticketIconRef) ticketIconRef.current.triggerAnimation()}}>
                            <p>Films</p>
                            <LordIcon ref={ticketIconRef} iconName={"ticket-white"} animationType={"hover"}/>
                        </div>
                        <div className={styles.navElem} onMouseEnter={() => {if (settingsIconRef) settingsIconRef.current.triggerAnimation()}}>
                            <p>Paramètres</p>
                            <LordIcon ref={settingsIconRef} iconName={"settings-white"} animationType={"hover"}/>
                        </div>
                        <div className={styles.navElem} onClick={logoutBtn} onMouseEnter={() => {if (logoutIconRef) logoutIconRef.current.triggerAnimation()}}>
                            <p>Déconnexion</p>
                            <LordIcon ref={logoutIconRef} iconName={"cross-white"} animationType={"hover"}/>
                        </div>

                    </div>
                    :
                    undefined
            }

        </nav>
    )
}