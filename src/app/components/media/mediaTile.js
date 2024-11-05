"use client";

import Image from "next/image";
import styles from '@/app/components/media/mediaTile.module.css';
import {useRouter} from "next/navigation";
import PageLoading from "@/app/components/ui/pageLoading";
import {useState} from "react";
import {localSaveMedia} from "@/app/controller/mediaController";
import Popup from "@/app/components/ui/popup";
export default function MediaTile({ movie }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [popupTitle, setPopupTitle] = useState('');
    const [popupMessage, setPopupMessage] = useState('');

    const openMoviePage = async () => {
        if (!movie.qualitiesLinks || movie.qualitiesLinks.length === 0) {
            setPopupTitle('Erreur');
            setPopupMessage('Aucun lien disponible pour ce film');
            setShowPopup(true);
            return;
        }

        setLoading(true);
         localSaveMedia(movie).then(() => {
             router.push("/home/media/" + movie.id)
         }).catch(() => {
             setLoading(false);
         });
    };

    const closePopup = () => {
        setShowPopup(false);
        setPopupTitle('');
        setPopupMessage('');
    }

    return (
        <div className={styles.movieResume} onClick={openMoviePage}>
            {showPopup ? <Popup title={popupTitle} text={popupMessage} close={closePopup}/> : null}
            {loading ? <PageLoading phrase={"enregistrement de la selection..."}/> : ""}
            <Image src={movie.poster} alt={movie.title} width={230} height={345} />
            <p>{movie.title}</p>
            <p>{movie.year}</p>
        </div>
    );

}