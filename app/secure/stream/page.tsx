'use client'
import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import Popup from "@/app/components/popup";
import Loading from "@/app/components/loading";
import StreamService from "@/app/services/streamService";

export default function Page() {

    const router = useRouter();

   const [loading, setLoading] = useState(true);
   const [loadingMessage, setLoadingMessage] = useState<string | null>(null);
   const [mediaLink, setMediaLink] = useState<string | null>(null);

    const [showPopup, setShowPopup] = useState<boolean>(false);
    const [popupTitle, setPopupTitle] = useState<string>("");
    const [popupContent, setPopupContent] = useState<string>("");

    useEffect(() => {
        let isMounted = true; // Drapeau pour éviter les appels multiples

        const actions = async () => {
            const params = new URLSearchParams(window.location.search);
            const tmdbId = params.get('tmdbId');
            setLoadingMessage("Scrapping du lien magnet...");
            if (!tmdbId) {
                setPopupTitle("Erreur");
                setPopupContent("Impossible de récuperer l'identifiant du media");
                setShowPopup(true);
                return;
            }
            const res = await StreamService.getMagnetLinks(tmdbId);

            if (!res.success) {
                setPopupTitle("Erreur");
                setPopupContent(res.error!);
                setShowPopup(true);
                return;
            }
            setLoadingMessage("Initialisation du streaming...");

            const resStream = await StreamService.getVideoLink(res.data![0].magnetLink);

            if (!resStream.success) {
                setPopupTitle("Erreur");
                setPopupContent(res.error!);
                setShowPopup(true);
                return;
            }

            if (isMounted) {
                setMediaLink(resStream.data!);
            }
        };

        actions().then(() => {
            if (isMounted) setLoading(false);
        });

        return () => {
            isMounted = false; // Nettoyage pour éviter les effets secondaires
        };
    }, []);
    return (
        <div>

            {
                !loading && mediaLink && <video src={mediaLink} autoPlay controls/>
            }
            <Popup showPopup={showPopup} onClose={() => router.back()} titre={popupTitle} texte={popupContent} />
            <Loading showLoading={loading} message={loadingMessage} />
        </div>
    );
}