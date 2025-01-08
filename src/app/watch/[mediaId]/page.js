'use client';

import {useParams, useRouter} from "next/navigation";
import {useEffect, useState} from "react";
import PageLoading from "@/app/components/ui/pageLoading";
import Popup from "@/app/components/ui/popup";
import {getUserPreferredSource} from "@/app/controller/settingsController";
import BackButton from "@/app/components/ui/backButton";
import {getMovieDetails} from "@/app/controller/mediaController";
import styles from "@/app/watch/[mediaId]/page.module.css"

export default function Watch() {
    const router = useRouter();
    const { mediaId } = useParams();
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loadingMessage, setLoadingMessage] = useState("");
    const [showPopup, setShowPopup] = useState(false);
    const [popupText, setPopupText] = useState("");
    const [source, setSource] = useState(null);

    useEffect(() => {
        setLoading(true)
        setLoadingMessage("Recuperation des informations du film...")
        getMovieDetails(mediaId).then((res) => {
            setLoading(false);
            if (!res.success) {
                setShowPopup(true);
                setPopupText("Une erreur est survenue lors de la recuperation des informations du film. Veuillez reessayer plus tard.");
            } else {
                setMovie(res.data)
                setLoadingMessage("Recuperation des preferences utilisateur...")
                getUserPreferredSource().then((res) => {
                    setLoading(false);
                    setSource(res);
                });
            }
        });
    }, []);

    const closePopup = () => {
        setShowPopup(false);
        router.back();
    }
    return (
        <main className={styles.watch}>
            <BackButton left={"20px"} top={"20px"}/>
            {movie && <h1>{movie.title}</h1>}
            {
                showPopup ? <Popup title={"Oups..."} text={popupText} close={closePopup}/> : null
            }
            {
                loading || !source ? <PageLoading phrase={loadingMessage}/> :
                    <iframe className={styles.iframe} src={source.endpoint + "movie/" + mediaId} frameBorder="0" allowFullScreen />
            }
        </main>

    );
}