"use client";

import Image from "next/image";
import styles from '@/app/components/media/mediaTile.module.css';
import {useRouter} from "next/navigation";
import PageLoading from "@/app/components/ui/pageLoading";
import {useState} from "react";
import {localSaveMedia} from "@/app/controller/mediaController";
import Popup from "@/app/components/ui/popup";
import LordIcon from "@/app/components/ui/lordIcon";
import MediaDetails from "@/app/components/media/mediaDetails";
export default function MediaTile({ media, onClickAction }) {
    const router = useRouter();

    return (
        <div className={styles.movieResume} onClick={onClickAction}>
            <Image src={media.poster && media.poster !== "" ? media.poster : "/assets/poster-placeholder.png"} alt={media.title} width={230} height={345} />
            <p>{media.title}</p>
            <p>{media.year}</p>
        </div>
    );

}