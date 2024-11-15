'use client';
import {useParams} from "next/navigation";
import styles from "@/app/user/page.module.css"
import {useState} from "react";
import MediaCarroussel from "@/app/components/media/mediaCarroussel";
import {getAll} from "@/app/controller/watchListController";

export default function Watch() {

    return (
        <div className={styles.user}>
            <MediaCarroussel title={"Votre liste de lecture"} mediaListFctn={getAll}/>
        </div>
    );
}