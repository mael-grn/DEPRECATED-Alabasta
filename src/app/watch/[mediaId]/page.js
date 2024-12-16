'use client';

import {useParams, useRouter} from "next/navigation";
import {useEffect, useState} from "react";
import PageLoading from "@/app/components/ui/pageLoading";
import VideoPlayer from "@/app/components/media/videoPlayer";
import Popup from "@/app/components/ui/popup";
import {searchStreamingLinks} from "@/app/controller/mediaController";
import {getSource} from "@/app/controller/settingsController";
import VidLink from "@/app/components/media/vidLink";
import OneHundredElevenMovies from "@/app/components/media/oneHundredElevenMovies";

export default function Watch() {
    const router = useRouter();
    const { mediaId } = useParams();
    const [loading, setLoading] = useState(true);
    const [loadingMessage, setLoadingMessage] = useState("");
    const [links, setLinks] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const [popupText, setPopupText] = useState("");
    const [source, setSource] = useState(null);

    useEffect(() => {
        setLoading(true)
        setLoadingMessage("Recuperation des preferences utilisateur...")
        getSource().then((res) => {
            setSource(res);
            if (res === "TheyAllSayFlix") {
                setLoadingMessage("Recherche des liens de streaming...");
                searchStreamingLinks(mediaId, "movie").then((res) => {
                    setLoading(false)
                    if (res.success) {
                        setLinks(res.data);
                    } else {
                        setPopupText(res.errorType);
                        setShowPopup(true);
                    }
                });
            } else {
                setLoading(false);
            }
        });

    }, []);

    const closePopup = () => {
        setShowPopup(false);
        router.back();
    }
    return (
        <main>
            {
                showPopup ? <Popup title={"Hop hop hop !"} text={popupText} close={closePopup}/> : null
            }
            {
                loading || !source ? <PageLoading phrase={loadingMessage}/> :
                    <div>
                        {source === "VidLinks" && <VidLink mediaId={mediaId}/>}
                        {source === "111movies" && <OneHundredElevenMovies mediaId={mediaId}/>}
                        {source === "TheyAllSayFlix" && links && <VideoPlayer links={links} movieId={mediaId}/>}
                    </div>
            }
        </main>

    );
}