'use client';

import MainPage from "@/app/components/mainPage";
import {useEffect, useState} from "react";
import MediaService from "@/app/services/mediaService";
import LightMedia from "@/app/models/lightMedia";
import LightMediaCarrousel from "@/app/components/lightMediaCarrousel";
import Popup from "@/app/components/popup";

export default function Page() {

    const [popularMovies, setPopularMovies] = useState<LightMedia[]>([]);

    const [showPopup, setShowPopup] = useState<boolean>(false);
    const [popupTitle, setPopupTitle] = useState<string>("");
    const [popupMessage, setPopupMessage] = useState<string>("");

    const [popuplarLoading, setPopularLoading] = useState<boolean>(true);

    useEffect(() => {
        setPopularLoading(true);
        MediaService.getPopular().then((medias) => {
            setPopularMovies(medias);
        }).catch((e) => {
            setShowPopup(true)
            setPopupTitle("Erreur");
            setPopupMessage(e);
        }).finally(() => setPopularLoading(false));
    }, []);

    return (
        <MainPage>
            <LightMediaCarrousel medias={popularMovies} title={"Films populaires"} loading={popuplarLoading} />
            <Popup show={showPopup} message={popupMessage} title={popupTitle} closePopup={() => setShowPopup(false)} />
        </MainPage>
    );
}