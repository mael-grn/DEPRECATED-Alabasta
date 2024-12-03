"use client"

import {useEffect, useState} from "react";
import {
    getMediaProgress,
    getMovieDetails,
    getSeasonDetails,
    getTvDetails,
    setMediaProgress
} from "@/app/controller/mediaController";
import PageLoading from "@/app/components/ui/pageLoading";

export default function VidLink({ mediaId, season, episode }) {
    const [loading, setLoading] = useState(true)
    const [url, setUrl] = useState("")
    const [lastWatchedProgress, setLastWatchedProgress] = useState(0)

    useEffect(() => {
        getMediaProgress(mediaId, season, episode).then((progress) => {
            setLoading(false);
            if (progress.success) {
                if (season && episode)
                    setUrl(`https://vidlink.pro/tv/${mediaId}/${season}/${episode}?startAt=${progress.data}`);
                else {
                    setUrl(`https://vidlink.pro/movie/${mediaId}?startAt=${progress.data}`);
                }
            } else {
                if (season && episode)
                    setUrl(`https://vidlink.pro/tv/${mediaId}/${season}/${episode}?nextbutton=true`);
                else {
                    setUrl(`https://vidlink.pro/movie/${mediaId}`);
                }
            }
        });
    }, []);

    useEffect(() => {
        const listenMessage = (event) => {
            if (event.origin !== 'https://vidlink.pro') {
                return;
            }

            if (event.data && event.data.type === 'MEDIA_DATA' && event.data.data[mediaId].progress.watched !== lastWatchedProgress) {
                setLastWatchedProgress(event.data.data[mediaId].progress.watched);
                setMediaProgress(mediaId, event.data.data[mediaId].progress.watched, event.data.data[mediaId].progress.duration, season, episode);
            }
        };

        window.addEventListener('message', listenMessage);
        return () => {
            window.removeEventListener('message', listenMessage);
        };
    }, [lastWatchedProgress]);

    return (
        loading ? <PageLoading phrase={"Récuperation de la progression..."}/> :
            <iframe src={url} style={{width: "100%", height: "100vh"}} frameBorder="0" allowFullScreen/>
    )
}