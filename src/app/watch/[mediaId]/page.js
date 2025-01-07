'use client';

import {useParams, useRouter} from "next/navigation";
import {useEffect, useState} from "react";
import PageLoading from "@/app/components/ui/pageLoading";
import Popup from "@/app/components/ui/popup";
import {getUserPreferredSource} from "@/app/controller/settingsController";

export default function Watch() {
    const router = useRouter();
    const { mediaId } = useParams();
    const [loading, setLoading] = useState(true);
    const [loadingMessage, setLoadingMessage] = useState("");
    const [showPopup, setShowPopup] = useState(false);
    const [popupText, setPopupText] = useState("");
    const [source, setSource] = useState(null);

    useEffect(() => {
        setLoading(true)
        setLoadingMessage("Recuperation des preferences utilisateur...")
        getUserPreferredSource().then((res) => {
            setLoading(false);
            setSource(res);
        });

    }, []);

    const closePopup = () => {
        setShowPopup(false);
        router.back();
    }
    return (
        <main>
            {
                showPopup ? <Popup title={"Oups..."} text={popupText} close={closePopup}/> : null
            }
            {
                loading || !source ? <PageLoading phrase={loadingMessage}/> :
                    <iframe src={source.endpoint + ""}>

                    </iframe>
            }
        </main>

    );
}