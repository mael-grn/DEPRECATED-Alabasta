'use client';
import {useParams, useRouter} from "next/navigation";
import styles from "@/app/home/watch/[mediaId]/page.module.css"
import {useEffect, useRef, useState} from "react";
import {
    initStreamMedia,
    searchStreamingLinks,
} from "@/app/controller/mediaController";
import PageLoading from "@/app/components/ui/pageLoading";
import VideoPlayer from "@/app/components/media/videoPlayer";
import Popup from "@/app/components/ui/popup";

export default function Watch() {

    const params = useParams();
    const [movieSrc, setMovieSrc] = useState('');
    const [loading, setLoading] = useState(true);
    const [magnetLinks, setMagnetLinks] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [popupTitle, setPopupTitle] = useState('');
    const [popupMessage, setPopupMessage] = useState('');
    const router = useRouter();

    useEffect(() => {
        setLoading(true);
        searchStreamingLinks(params.mediaId).then((response) => {
            if(response.success && response.data && response.data.yts.length > 0) {
                const magnet = response.data.yts[0].magnetLink;
                setMagnetLinks(response.data.yts);
                getLink(magnet).then(() => {
                    setLoading(false);
                });
            } else {
                setLoading(false);
                setShowPopup(true)
                setPopupTitle("Erreur");
                setPopupMessage("Impossible de récuperer les liens de streaming");
            }
        });
    },[]);

    const getLink = async (magnet) => {
        initStreamMedia(magnet).then((response) => {
            setMovieSrc(response.data);
        });
    }

    const closePopup = () => {
        setShowPopup(false);
        setPopupTitle('');
        setPopupMessage('');
        router.back()
    }

    return (
        <div className={styles.watch}>
            {loading ? <PageLoading phrase={'Récuperation du lien...'}/> : null}
            {!loading && movieSrc ?
                 <VideoPlayer movieId={params.mediaId} magnetLinks={magnetLinks} src={movieSrc} changeLinkFctn={getLink}/>
                : null
            }
            {showPopup ? <Popup title={popupTitle} text={popupMessage} close={closePopup}/> : null}
        </div>
    );
}