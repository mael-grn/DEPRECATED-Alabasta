'use client';

import {useParams, useRouter} from "next/navigation";
import {useEffect, useState} from "react";
import {TmdbMagnetLink} from "@/app/models/tmdbMagnetLink";
import MediaService from "@/app/services/mediaService";
import {ButtonProps} from "@/app/components/Button";
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

    const [loadingMessage, setLoadingMessage] = useState<string>('Chargement en cours...');

    const getMediaId = () => {
        if (!mediaId || mediaId.length === 0) {
            setPopupTitle('Erreur');
            setPopupContent('L\'identifiant du média est invalide.');
            setClosePopup(() => () => router.back());
            setShowPopup(true);
            return null;
        }
        return mediaId as string;
    }

    const getMagnetLinks = async () => {
        try {
            const id = getMediaId();
            if (!id) return;
            let magnets = await MediaService.getMagnetLinks(id);
            //Si on a aucun lien, on va essayer d'en rechercher
            if (magnets.length === 0){
                setLoadingMessage('Aucun lien n\'a été enregistré auparavant. Nous en recherchons pour vous...');
                magnets = await MediaService.searchMagnetLinks(id)
                //Si toujours aucun lien, on affiche un message et retour a la page d'accueil
                if (magnets.length === 0) {
                    setPopupTitle('Aucun lien trouvé');
                    setPopupContent("Nous n'avons pas trouvé de liens pour ce média. Veuillez réessayer plus tard, ou contacter un administrateur.");
                    setClosePopup(() => () => router.back());
                    setShowPopup(true);
                    return;
                }
            }
            setMagnetLinks(magnets);
            setLoadingMessage('Initialisation du lecteur...');
            setStreamLink(await MediaService.initStream(magnets[0]));
        } catch (e) {
            setPopupTitle('Erreur');
            setPopupContent((e as string));
            setClosePopup(() => () => router.back());
            setShowPopup(true);
            return;
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getMagnetLinks();
    }, [getMagnetLinks()]);
    return (
        <div>
            {
                streamLink && <video src={streamLink} controls />
            }
            <Popup show={showPopup} message={popupContent} title={popupTitle} closePopup={closePopup} actions={popupActions}/>
            <LoadingPopup show={loading} message={loadingMessage}/>
        </div>
    )
}