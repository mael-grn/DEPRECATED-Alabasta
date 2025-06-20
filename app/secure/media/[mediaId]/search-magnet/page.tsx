'use client';

import {useParams, useRouter} from "next/navigation";
import {useEffect, useState} from "react";
import MediaService from "@/app/services/mediaService";
import {ActionTypeEnum, ButtonProps} from "@/app/components/Button";
import Popup from "@/app/components/popup";

export default function Page() {

    const router = useRouter();

    const {mediaId} = useParams();

    const [showPopup, setShowPopup] = useState(false);
    const [popupContent, setPopupContent] = useState('');
    const [popupTitle, setPopupTitle] = useState<string>('');
    const [popupActions, setPopupActions] = useState<ButtonProps[]>([]);

    useEffect(() => {
        MediaService.searchMagnetLinks(mediaId as string).then((links) => {
            setShowPopup(true);
            setPopupTitle("Chargement réussi !")
            setPopupContent(`Nous avons trouvé ${links.length || 1} source(s) pour ce média.`)
            setPopupActions([{actionType: ActionTypeEnum.safe, text: "Continuer vers la lecture", iconName: "arrow-right", onClick: () => router.push(`/secure/media/${mediaId}/stream`)}]);
        }).catch((e) => {
            setShowPopup(true);
            setPopupTitle("Erreur")
            setPopupContent(e);
        })


    }, [mediaId, router]);
    return (
        <div className={"flex flex-col items-center justify-center h-screen w-full gap-6"}>
            <img src={'/icons/loader-light.gif'} alt={'loading'} className={'w-12'}/>
            <p>Nous sommes en train de rechercher des liens pour votre media. Cette action peut prendre quelques instants. Merci de ne pas quitter cette page.</p>
            <Popup show={showPopup} message={popupContent} title={popupTitle} closePopup={() => router.push('/secure/home')} actions={popupActions} isCloseDangerous={true}/>
        </div>
    )
}