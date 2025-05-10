'use client'

import {useEffect, useState} from "react";
import LightMedia from "@/app/models/LightMedia";
import TmdbService from "@/app/services/tmdbService";
import Popup from "@/app/components/popup";
import LightMediaCarrousel from "@/app/components/LightMediaCarrousel";

export default function Page() {

    const [popularLoading, setPopularLoading] = useState(true);
    const [popularMovies, setPopularMovies] = useState<LightMedia[]>([]);

    const [showPopup, setShowPopup] = useState<boolean>(false);
    const [popupTitle, setPopupTitle] = useState<string>("");
    const [popupContent, setPopupContent] = useState<string>("");

    useEffect(() => {
        const actions = async () => {
            const res = await TmdbService.getPopularMovies()

            if (!res.success) {
                setPopupTitle("Une erreur s'est produite");
                setPopupContent(res.error ?? "Aucun detail");
                setShowPopup(true);
            }
            setPopularMovies(res.data ?? []);
        }

        setPopularLoading(true);
        actions().finally(() => setPopularLoading(false))
    }, []);
    return (
        <div>
            <LightMediaCarrousel mediaList={popularMovies} title={"Films populaires"} isLoading={popularLoading} />

            <Popup showPopup={showPopup} onClose={() => setShowPopup(false)} titre={popupTitle} texte={popupContent}/>
        </div>
    );
}