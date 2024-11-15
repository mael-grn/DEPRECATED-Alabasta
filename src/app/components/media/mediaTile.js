"use client";

import Image from "next/image";
import styles from '@/app/components/media/mediaTile.module.css';
import {useRouter} from "next/navigation";
import PageLoading from "@/app/components/ui/pageLoading";
import {useState} from "react";
import {localSaveMedia} from "@/app/controller/mediaController";
import Popup from "@/app/components/ui/popup";
import LordIcon from "@/app/components/ui/lordIcon";
export default function MediaTile({ movie }) {
    const router = useRouter();

    const openMoviePage = async () => {
        router.push("/media/" + movie.id)
    };


    return (
        <div className={styles.movieResume} onClick={openMoviePage}>
            <Image src={movie.poster} alt={movie.title} width={230} height={345} />
            <p>{movie.title}</p>
            <p>{movie.year}</p>
        </div>
    );

}