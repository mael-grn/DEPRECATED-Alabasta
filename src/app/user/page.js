'use client';
import {useParams, useRouter} from "next/navigation";
import styles from "@/app/user/page.module.css"
import {useState} from "react";
import MediaCarroussel from "@/app/components/media/mediaCarroussel";
import {getAll} from "@/app/controller/watchListController";
import {logout} from "@/app/controller/userController";
import {getContinueWatching} from "@/app/controller/mediaController";

export default function Watch() {
    const router = useRouter();
    const logoutAction = () => {
        logout().then(() => {
            router.push('/');
        });
    }
    return (
        <div className={styles.user}>
            <MediaCarroussel title={"Votre liste"} mediaListFctn={getAll}/>
            <MediaCarroussel mediaListFctn={getContinueWatching} title={"Continuer la lecture"}/>
            <button className={styles.logoutBtn} onClick={logoutAction}>Déconnexion</button>
        </div>
    );
}