"use client";

import MediaTile from "@/app/components/media/mediaTile";
import LordIcon from "@/app/components/ui/lordIcon";
import {useEffect, useRef, useState} from "react";
import styles from "@/app/components/media/mediaCarroussel.module.css";

export default function MediaCarroussel({mediaListFctn, title}) {
    const mediaListRef = useRef(null);
    const [mediaList, setMediaList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState(null);
    const [showLeftBtn, setShowLeftBtn] = useState(false);
    const [showRightBtn, setShowRightBtn] = useState(true);

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

    const scrollMovieList = (scrollAmount) => {
        if (mediaListRef.current) {
            mediaListRef.current.scrollBy({
                left: scrollAmount,
                behavior: "smooth"
            });
        }
    };

    const handleScroll = () => {
        const scrollLeft = mediaListRef.current.scrollLeft;
        const maxScrollLeft = mediaListRef.current.scrollWidth - mediaListRef.current.clientWidth;

        setShowLeftBtn(scrollLeft > 0);
        setShowRightBtn(scrollLeft < maxScrollLeft);
    };

    useEffect(() => {
        const mediaListElement = mediaListRef.current;
        if (mediaListElement) {
            mediaListElement.addEventListener("scroll", handleScroll);
            handleScroll(); // Initial call to set button visibility

            return () => mediaListElement.removeEventListener("scroll", handleScroll);
        }
    }, [mediaList]);

    if (loading) {
        return (
            <div className={`${styles.carroussel} ${styles.loading}`}>
                <LordIcon iconName={"loader-white"} animationType={"loop"} />
            </div>
        );
    }

    if (errorMsg) {
        return (
            <div className={`${styles.carroussel} ${styles.error}`}>
                {errorMsg}
            </div>
        );
    }

    if (!loading && mediaList.length === 0) {
        return (
            <div className={styles.carroussel}>
                <h1 className={styles.title}>{title}</h1>
                <div className={styles.mediaList} ref={mediaListRef}>
                    <p>Rien à afficher pour le moment...</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.carroussel}>
            <h1 className={styles.title}>{title}</h1>
            <div className={styles.mediaList} ref={mediaListRef}>
                {mediaList.map((movie, index) => (
                    <div key={index}>
                        <MediaTile movie={movie} />
                    </div>
                ))}
            </div>
            <button
                onClick={() => scrollMovieList(220)}
                className={`${styles.rightButton} ${showRightBtn ? "" : styles.hide}`}
            >
                <LordIcon iconName={"circleArrow-white"} animationType={"hover"} />
            </button>
            <button
                onClick={() => scrollMovieList(-220)}
                className={`${styles.leftButton} ${showLeftBtn ? "" : styles.hide}`}
            >
                <LordIcon iconName={"circleArrow-white"} animationType={"hover"} />
            </button>
        </div>
    );
}
