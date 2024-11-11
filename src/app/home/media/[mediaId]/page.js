'use client'

import {useEffect, useRef, useState} from "react";
import {
    getMediaDetails,
    localRecoverMedia,
    localSaveMedia,
    searchStreamingLinks
} from "@/app/controller/mediaController";
import Popup from "@/app/components/ui/popup";
import LordIcon from "@/app/components/ui/lordIcon";
import styles from "@/app/home/media/[mediaId]/page.module.css"
import Image from "next/image";
import {useParams, useRouter} from "next/navigation";
import PageLoading from "@/app/components/ui/pageLoading";
import {addToWatchList, checkIfInWatchList, removeFromWatchList} from "@/app/controller/watchListController";

export default function media() {
    const [loading, setLoading] = useState(true);
    const [showPopup, setShowPopup] = useState(false);
    const [popupTitle, setPopupTitle] = useState('');
    const [popupMessage, setPopupMessage] = useState('');
    const [inWatchList, setInWatchList] = useState(false);
    const [watchListLoading, setWatchListLoading] = useState(true);
    const [streamLinkLoading, setStreamLinkLoading] = useState(true);
    const [streamLinks, setStreamLinks] = useState([]);
    const [loadingMessage, setLoadingMessage] = useState("Récuperation des données du média...");
    const [media, setMedia] = useState([]);
    const params = useParams();
    const watchBtnRef = useRef(null);
    const backBtnRef = useRef(null);
    const router = useRouter()

    useEffect(() => {
        getMediaDetails(params.mediaId).then((media) => {
            if (media) {
                setMedia(media.data);
                setLoading(false)
                checkIfInWatchList(params.mediaId).then((response) => {
                    setWatchListLoading(false);
                    if (response.data) {
                        setInWatchList(true);
                    }
                });

            } else {
                setShowPopup(true);
                setPopupTitle('Erreur');
                setPopupMessage('Impossible de récuperer les données du film');
            }
        });
        searchStreamingLinks(params.mediaId).then((response) => {
            setStreamLinkLoading(false);
            if (response.success) {
                setStreamLinks(response.data);
            }
        });
    }, []);

    const closePopup = () => {
        setShowPopup(false);
        setPopupTitle('');
        setPopupMessage('');
    }

    const toggleWatchList = () => {
        setWatchListLoading(true)
        if (inWatchList) {
            removeFromWatchList(media.id).then((response) => {
                setWatchListLoading(false)
                if (response.success) {
                    setInWatchList(false);
                } else {
                    setPopupTitle('Erreur');
                    setPopupMessage(response.errorType);
                    setShowPopup(true);
                }
            });
        } else {
            addToWatchList(media.id).then((response) => {
                setWatchListLoading(false)
                if (response.success) {
                    setInWatchList(true);
                } else {
                    setPopupTitle('Erreur');
                    setPopupMessage(response.errorType);
                    setShowPopup(true);
                }
            });
        }
    }

    return (
        <div className={styles.mediaDetails}>

            {loading ? null : <Image className={`${styles.bgImage}`} src={media.poster} alt={"backdrop"} width={500} height={750}/>}
            {loading ? <PageLoading phrase={loadingMessage}/> :
                <div>
                    <div className={styles.mediaDetailsMain}>
                        <button className={styles.backButton} onClick={() => router.back()}>
                            <LordIcon iconName={"arrow-white"} animationType={"hover"}/>
                            Retour
                        </button>
                        <h1>{media.title}</h1>
                        <div className={styles.genreTag}>
                            {
                                media.genres.map((genre) => {
                                    return <p>{genre}</p>
                                })
                            }
                        </div>
                        <div className={styles.buttonDiv}>
                            <button
                                className={styles.watchBtn}
                                disabled={!streamLinkLoading && (!streamLinks || streamLinks.length === 0)}
                                onClick={() => router.push("/home/watch/" + media.id)}
                            >
                                {streamLinkLoading ? <LordIcon iconName={"loader-white"} animationType={"loop"}/> : (
                                    streamLinks.yts && streamLinks.yts.length > 0 ?
                                        <div>
                                            {streamLinks.yts ?
                                                <Image className={styles.providerLogo} src={"/icons/logo-YTS.svg"}
                                                       alt={"yts icon"} width={100} height={100}/> : ""}
                                            <p>Regarder</p>
                                            <LordIcon ref={watchBtnRef} iconName={"play-white"}
                                                      animationType={"hover"}/>
                                        </div>
                                        : "Aucun lien disponible pour le moment"

                                )}
                            </button>
                            <button
                                onClick={toggleWatchList}
                                className={inWatchList && !watchListLoading ? styles.inWatchList : ""}
                            >
                                {watchListLoading ? <LordIcon iconName={"loader-black"} animationType={"loop"}/> : null}
                                {!watchListLoading ?
                                    <LordIcon iconName={inWatchList ? "bookmark-white" : "bookmark-black"}
                                              animationType={"hover"}/> : null}
                                {inWatchList && !watchListLoading ? "Dans la liste de lecture" : null}
                            </button>
                        </div>

                        <p className={styles.overview}>{media.overview}</p>
                    </div>
                    <div className={styles.mediaDetailsSecondary}>
                        <Image src={media.poster} alt={"poster"} width={500} height={750}/>
                        <div className={styles.secondaryContent}>
                        <p>Durée : {media.runtime}</p>
                            <p>Pays : {media.country}</p>
                            <p>Langue : {media.language}</p>
                            {media.budget ? <p>Budget : {media.budget}</p> : null}
                            {media.revenue ? <p>revenue : {media.revenue}</p> : null}
                        </div>
                    </div>
                </div>
            }
            {showPopup ? <Popup title={popupTitle} text={popupMessage} close={closePopup}/> : null}
        </div>
    );
}