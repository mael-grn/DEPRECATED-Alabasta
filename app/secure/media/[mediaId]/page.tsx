'use client';

import {useParams, useRouter} from "next/navigation";
import {useEffect, useState} from "react";
import {Media} from "@/app/models/media";
import MediaService from "@/app/services/mediaService";
import LoadingPopup from "@/app/components/loadingPopup";
import Section, {SectionWeight, SectionWidth} from "@/app/components/section";
import {ActionTypeEnum} from "@/app/components/Button";
import MainPage, {PageAlignmentEnum} from "@/app/components/mainPage";
import Popup from "@/app/components/popup";

export default function Page() {

    const {mediaId} = useParams();

    const router = useRouter();

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

    if (loading) {
        return <LoadingPopup show={loading} message={"Récupération des informations du média..."}/>
    }

    if (!media) {
        return (
            <MainPage title={"Média introuvable"} pageAlignment={PageAlignmentEnum.center}>
                <Section>
                    <p>Aucun média trouvé avec l&apos;identifiant {mediaId}.</p>
                </Section>
            </MainPage>
        );
    }

    return (
        <MainPage title={media?.title} pageAlignment={PageAlignmentEnum.tileStart}>
            <img src={media?.posterUrl} alt={media?.title} className={"rounded-xl md:w-72 w-full border-1 border-on-background-hover"}/>

            <Section weight={SectionWeight.HEAVY} actions={[{iconName:"bookmark", text:"Enregistrer"}, {iconName:"play", text:"regarder", actionType: ActionTypeEnum.dangerous, onClick: () => router.push(`/secure/media/${mediaId}/watch`)}]}>
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

            <Section weight={SectionWeight.MEDIUM} title={"Notes"} actions={[{iconName: "add", text: "Ajouter une note"}]}>
                <div className={"flex gap-2 items-end"}>
                    <h2>{media?.vote}</h2>
                    <p className={"text-on-foreground-hover"}>/10</p>
                </div>
                <p className={"text-on-foreground-hover italic"}>Comptabilisé sur {media?.voteCount} avis</p>
            </Section>



            <Section title={"Résumé"} width={SectionWidth.HALF}>
                <p>{media?.overview}</p>
            </Section>
            <Popup show={showPopup} message={popupMessage} title={popupTitle} closePopup={() => setShowPopup(false)}/>

        </MainPage>
    );
}