'use client'

import {useEffect, useRef, useState} from "react";
import {getMediaDetails, localRecoverMedia, localSaveMedia} from "@/app/controller/mediaController";
import Popup from "@/app/components/ui/popup";
import LordIcon from "@/app/components/ui/lordIcon";
import styles from "@/app/home/media/[mediaId]/page.module.css"
import Image from "next/image";
import {useParams, useRouter} from "next/navigation";
import PageLoading from "@/app/components/ui/pageLoading";

export default function media() {
    const [loading, setLoading] = useState(true);
    const [showPopup, setShowPopup] = useState(false);
    const [popupTitle, setPopupTitle] = useState('');
    const [popupMessage, setPopupMessage] = useState('');
    const [media, setMedia] = useState(null);
    const params = useParams();
    const watchBtnRef = useRef(null);
    const backBtnRef = useRef(null);
    const router = useRouter()

    useEffect(() => {
        localRecoverMedia(params.mediaId).then((movie) => {
            getMediaDetails(movie).then((response) => {
                console.log(response);
                if (response.success) {
                    localSaveMedia(response.data).then(() => {
                        setMedia(response.data);
                        setLoading(false)
                    })
                } else {
                    setPopupTitle('Erreur');
                    setPopupMessage(response.errorType);
                    setShowPopup(true);
                }
            }).catch(() => {
                setPopupTitle('Erreur');
                setPopupMessage('Erreur lors de la récupération des détails du film');
                setShowPopup(true);
            });
        });
    }, []);

    const closePopup = () => {
        setShowPopup(false);
        setPopupTitle('');
        setPopupMessage('');
    }

    return (
        <div>
            {showPopup ? <Popup title={popupTitle} text={popupMessage} close={closePopup}/> : null}
            {loading ? <PageLoading phrase={"Récuperation des données du média..."}/> :
                <div className={styles.mediaResume}>
                    <div className={styles.mediaContentDiv}>
                        <button className={styles.backButton} onClick={() => router.back()} onMouseEnter={() => {if (backBtnRef) backBtnRef.current.triggerAnimation()}}>
                            <LordIcon ref={backBtnRef} iconName={"arrow-white"} animationType={"hover"}/>
                            Retour
                        </button>
                        <h1>{media.title}</h1>
                        <p>{media.year}   ●   {media.genre}</p>
                        <div className={styles.buttonDiv}>

                            <button disabled={!media.qualitiesLinks || media.qualitiesLinks===0} onMouseEnter={() => {if (watchBtnRef) watchBtnRef.current.triggerAnimation()}} onClick={() => router.push("/home/watch/" + media.id)}>
                                Regarder
                                <LordIcon ref={watchBtnRef} iconName={"play-white"} animationType={"hover"}/>
                            </button>
                            <button>
                                <LordIcon iconName={"bookmark-black"} animationType={"hover"}/>
                            </button>
                        </div>
                        <div className={styles.actorDiv}>
                            <div>
                                <Image src={"/assets/profile_placeholder.png"} alt={"director"} width={100} height={100}/>
                                <p>{media.director} (réalisateur)</p>
                            </div>
                            {
                                media.actors.map((actor, index) => {
                                    return (
                                        <div key={index}>
                                            <Image src={"/assets/profile_placeholder.png"} alt={"director"} width={100} height={100}/>
                                            <p>{actor}</p>
                                        </div>
                                    )
                                })
                            }
                        </div>

                        <p className={styles.plot}>{media.plot}</p>
                    </div>
                    <div className={styles.mediaDetailsDiv}>
                        <Image src={media.poster} alt={media.title} width={1080} height={1620}/>
                        <p>Durée : {media.runtime}</p>
                        <p>Pays : {media.country}</p>
                        <p>Récompenses : {media.awards}</p>
                        <p>Scénariste : {media.writer}</p>
                        <p>Qualités disponibles : <ul> {
                            media.qualitiesLinks.map((quality, index) => {
                                return <li key={index}>{quality.quality}</li>
                            })
                        }</ul> </p>
                        <p>Source : {media.provider}</p>
                    </div>
                </div>
            }

        </div>
    );
}