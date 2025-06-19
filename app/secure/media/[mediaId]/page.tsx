'use client';

import {useParams} from "next/navigation";
import {useEffect, useState} from "react";
import {Media} from "@/app/models/media";
import MediaService from "@/app/services/mediaService";
import LoadingPopup from "@/app/components/loadingPopup";
import Section from "@/app/components/section";
import {ActionTypeEnum} from "@/app/components/Button";
import MainPage, {PageAlignmentEnum} from "@/app/components/mainPage";
import Popup from "@/app/components/popup";

export default function Page() {

    const {mediaId} = useParams();


    const [media, setMedia] = useState<Media | null>(null);
    const [loading, setLoading] = useState(true);


    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState("");
    const [popupTitle, setPopupTitle] = useState("");

    useEffect(() => {
        if (!mediaId || isNaN(Number(mediaId))) {
            setLoading(false);
            setShowPopup(true);
            setPopupTitle("Erreur");
            setPopupMessage("L'identifiant du média est manquant ou invalide.");
            return;
        }
        MediaService.getDetails(mediaId.toString()).then((data) => {
            setMedia(data);
        }).catch((e) => {
            setShowPopup(true);
            setPopupTitle("Erreur");
            setPopupMessage(e);
        }).finally(() => setLoading(false));
    }, [mediaId]);


    return (
        <MainPage title={media?.title} pageAlignment={PageAlignmentEnum.tileStart}>
            <img src={media?.posterUrl} alt={media?.title} className={"rounded-xl md:w-72 w-full border-1 border-on-background-hover"}/>

            {
                !loading && <>

                </>
            }
            <Section actions={[{iconName:"bookmark", text:"Enregistrer"}, {iconName:"play", text:"regarder", actionType: ActionTypeEnum.dangerous}]}>
                <p className={"text-xs text-on-foreground-hover"}>ID: {media?.imdbId}</p>
                <h1>{media?.title}</h1>

                <p className={"text-on-foreground-hover italic"}>{media?.type} ● {media?.year} ● {media?.runtime}min</p>
                <div className={"flex gap-2 flex-wrap"}>
                {
                    media?.genres.map((genre, index) => (
                        <span key={index} className={"bg-on-background-hover text-on-foreground-hover px-3 py-1 rounded-sm"}>
                                {genre}
                            </span>
                    ))
                }
            </div>
            </Section>


            <Section title={"Notes"} actions={[{iconName: "add", text: "Ajouter une note"}]}>
                <div className={"flex gap-3"}>
                    <img src={"/icons/star.svg"} alt={"star"} className={"w-10 invert"}/>
                    <h1>{media?.vote} / 10</h1>
                </div>
                <p className={"text-on-foreground-hover italic"}>Comptabilisé sur {media?.voteCount} avis</p>
            </Section>

            <Section title={"Résumé"}>
                <p>{media?.overview}</p>
            </Section>
            <LoadingPopup show={loading}/>
            <Popup show={showPopup} message={popupMessage} title={popupTitle} closePopup={() => setShowPopup(false)}/>
        </MainPage>
    );
}