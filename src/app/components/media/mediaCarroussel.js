"use client"

import MediaTile from "@/app/components/media/mediaTile";
import LordIcon from "@/app/components/ui/lordIcon";
import {useEffect, useRef, useState} from "react";
import styles from "@/app/components/media/mediaCarroussel.module.css";

export default function MediaCarroussel({mediaListFctn, title}) {

    const mediaListRef = useRef(null); // Crée une référence pour la div
    const [mediaList, setMediaList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState(null);

    useEffect(() => {
        mediaListFctn().then((response) => {
            setLoading(false);
            if (response.success) {
                setMediaList(response.data);
            } else {
                setErrorMsg("Une erreur est survenue lors de la récuperation de : " + title);
            }
        });
    }, []);

    const scrollMovieList = (movieListRef, scrollAmount) => {
        // Déclenche le défilement horizontal
        if (movieListRef.current) {
            movieListRef.current.scrollBy({
                left: scrollAmount, // Offset de défilement
                behavior: "smooth"  // Défilement fluide
            });
        }
    };

    if (loading) {
        return (
            <div className={`${styles.carroussel} ${styles.loading}`}>
                <LordIcon iconName={"loader-white"} animationType={"loop"}/>
            </div>
        )
    }

    if (errorMsg) {
        return (
            <div className={`${styles.carroussel} ${styles.error}`}>
                {errorMsg}
            </div>
        )
    }

    return (
        <div className={styles.carroussel}>
            <h1 className={styles.title}>{title}</h1>
            <div className={styles.mediaList} ref={mediaListRef}>
                {
                    mediaList.map(
                        (movie, index) => {
                            return (
                                <div key={index}>
                                    <MediaTile movie={movie}/>
                                </div>

                            );
                        }
                    )
                }

            </div>
            <button onClick={() => scrollMovieList(mediaListRef, 220)}
                    className={styles.rightButton}>
                <LordIcon
                    iconName={"circleArrow-white"} animationType={"hover"}/></button>
            <button onClick={() => scrollMovieList(mediaListRef, -220)}
                    className={styles.leftButton}>
                <LordIcon
                    iconName={"circleArrow-white"} animationType={"hover"}/></button>

        </div>
    )
}