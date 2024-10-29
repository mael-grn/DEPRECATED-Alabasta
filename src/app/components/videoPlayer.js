// pages/watch.js
import { useState, useEffect } from "react";
import {streamMovie} from "@/app/utils/queryUtils";

export default function VideoPlayer({ torrentUrl }) {
    const [videoSrc, setVideoSrc] = useState(null);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        setLoading(true);

        streamMovie(torrentUrl).then((response) => {
            setLoading(false)
            if (response.success) {
                setVideoSrc(response.data);
            }
            else {
                console.log(response.errorType);
            }
        })


    }, [torrentUrl]);

    return (
        <div>
            {videoSrc ? (
                <video src={videoSrc} controls autoPlay />
            ) : (
                loading ?
                <p style={{color: "white"}}>Chargement de la vidéo...</p>
                    :
                    <p>Chargement termine</p>
            )}
        </div>
    );
}