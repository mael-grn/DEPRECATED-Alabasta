'use client';

import {useParams, useRouter} from "next/navigation";
import {useEffect, useState} from "react";
import {TmdbMagnetLink} from "@/app/models/tmdbMagnetLink";
import MediaService from "@/app/services/mediaService";
import {ActionTypeEnum, ButtonProps} from "@/app/components/Button";
import LoadingPopup from "@/app/components/loadingPopup";
import Popup from "@/app/components/popup";

export default function Page() {

    const router = useRouter();

    const {mediaId} = useParams();
    const [magnetLinks, setMagnetLinks] = useState<TmdbMagnetLink[]>([]);

    const [streamLink, setStreamLink] = useState<string|null>(null);

    const [loading, setLoading] = useState(true);

    const [showPopup, setShowPopup] = useState(false);
    const [popupContent, setPopupContent] = useState('');
    const [popupTitle, setPopupTitle] = useState<string>('');
    const [closePopup, setClosePopup] = useState<VoidFunction>(() => setShowPopup(false));
    const [popupActions, setPopupActions] = useState<ButtonProps[]>([]);
    const [isCloseDangerous, setIsCloseDangerous] = useState<boolean>(false);

    useEffect(() => {
        async function fetchData() {
            if (!mediaId || isNaN(parseInt(mediaId.toString()))) {
                setPopupTitle('Erreur');
                setPopupContent('L\'identifiant du média est invalide.');
                setClosePopup(() => () => router.push("/secure/home"));
                setIsCloseDangerous(true);
                setShowPopup(true);
                return;
            }

            try {
                const magnets = await MediaService.getMagnetLinks(mediaId!.toString());
                if (magnets.length === 0){
                    setPopupTitle('Pas si vite !');
                    setPopupContent('Il semble que vous êtes le premier à vouloir visionner ce média. Nous devons dans un premier temps le rechercher pour vous. Cela ne prendra que quelques instants.');
                    setClosePopup(() => () => router.push("/secure/home"));
                    setPopupActions(() => [{iconName: "arrow-right", text: "Continuer", actionType: ActionTypeEnum.safe, onClick: () => router.push(`/secure/media/${mediaId}/search-magnet`)}]);
                    setIsCloseDangerous(true);
                    setShowPopup(true);
                    return;
                } else {
                    setMagnetLinks(magnets);
                    setStreamLink(await MediaService.initStream(magnets[0]));
                }
                console.log(magnetLinks[0]);
            } catch (e) {
                setPopupTitle('Erreur');
                setPopupContent((e as string));
                setClosePopup(() => () => router.push("/secure/home"));
                setIsCloseDangerous(true);
                setShowPopup(true);
                return;
            } finally {
                setLoading(false)
            }
        }

        fetchData();
    }, [mediaId, router]);
    return (
        <div>
            {
                streamLink && <video src={streamLink} controls />
            }
            <Popup show={showPopup} message={popupContent} title={popupTitle} closePopup={closePopup} actions={popupActions} isCloseDangerous={isCloseDangerous}/>
            <LoadingPopup show={loading}/>
        </div>
    )
}