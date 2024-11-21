'use client';

import {useParams, useRouter} from "next/navigation";
import {useEffect, useState} from "react";
import PageLoading from "@/app/components/ui/pageLoading";
import VideoPlayer from "@/app/components/media/videoPlayer";
import Popup from "@/app/components/ui/popup";
import {searchStreamingLinks} from "@/app/controller/mediaController";

export default function Watch() {
    const router = useRouter();
    const { mediaId } = useParams();
    const [loading, setLoading] = useState(true);
    const [links, setLinks] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const [popupText, setPopupText] = useState("");

    useEffect(() => {
        setLoading(true)
        searchStreamingLinks(mediaId, "movie").then((res) => {
            setLoading(false)
            if (res.success) {
                setLinks(res.data);
            } else {
                setPopupText(res.errorType);
                setShowPopup(true);
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
                loading || !links ?
                    <PageLoading phrase={"Chargement du contenu"}/> :
                    <VideoPlayer links={links} movieId={mediaId}/>
            }
        </main>

    );
}