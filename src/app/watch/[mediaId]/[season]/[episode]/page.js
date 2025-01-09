'use client';

import {useParams, useRouter} from "next/navigation";
import {useEffect, useState} from "react";
import PageLoading from "@/app/components/ui/pageLoading";
import Popup from "@/app/components/ui/popup";
import {getUserPreferredSource} from "@/app/controller/settingsController";
import BackButton from "@/app/components/ui/backButton";
import {getSeasonDetails, getTvDetails} from "@/app/controller/mediaController";
import styles from "@/app/watch/[mediaId]/page.module.css"

export default function Watch() {
    const router = useRouter();
    const { mediaId, season, episode } = useParams();
    const [url, setUrl] = useState("");
    const [show, setShow] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loadingMessage, setLoadingMessage] = useState("");
    const [showPopup, setShowPopup] = useState(false);
    const [popupText, setPopupText] = useState("");
    const [source, setSource] = useState(null);

    useEffect(() => {
        setLoading(true)
        setLoadingMessage("Recuperation des informations de l'episode...")
        getTvDetails(mediaId).then((res) => {
            setLoading(false);
            if (!res.success) {
                setShowPopup(true);
                setPopupText("Une erreur est survenue lors de la recuperation des informations de l'episode. Veuillez reessayer plus tard.");
            } else {
                setShow(res.data)


                setLoadingMessage("Recuperation des preferences utilisateur...")
                getUserPreferredSource().then((res) => {
                    setSource(res);
                    switch (res) {
                        case "TurboVid":
                            setLoadingMessage("Encore un instant...")
                            getSeasonDetails(show.id, season).then((res) => {
                                if (!res.success) {
                                    setShowPopup(true);
                                    setPopupText("Une erreur est survenue lors de la recuperation des informations de l'episode. Veuillez reessayer plus tard.");
                                } else {
                                    setUrl(source.endpoint + "movie/" + res.data.children[episode].id);
                                    setLoading(false)
                                }
                            });
                            break;
                        case "111movies":
                            setUrl(source.endpoint + "tv/" + show.id + "/" + season + "/" + episode);
                            setLoading(false)
                            break;
                        default:
                            setPopupText("Oups, un dévellopeur a fait une erreur. Veuillez reessayer plus tard.");
                            setShowPopup(true);
                    }
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
            {show && <h1>{show.title}</h1>}
            {
                showPopup ? <Popup title={"Oups..."} text={popupText} close={closePopup}/> : null
            }
            {
                loading || !source ? <PageLoading phrase={loadingMessage}/> :
                    <iframe className={styles.iframe} src={url} frameBorder="0" allowFullScreen />
            }
        </main>

    );
}