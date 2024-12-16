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

export default function OneHundredElevenMovies({ mediaId, season, episode }) {
    const [url, setUrl] = useState("")

    useEffect(() => {
        if (season && episode)
            setUrl(`https://111movies.com/tv/${mediaId}/${season}/${episode}`);
        else {
            setUrl(`https://111movies.com/movie/${mediaId}`);
        }
    }, []);

    useEffect(() => {
        const listenMessage = (event) => {
            console.log(event.data);
        };

        window.addEventListener('message', listenMessage);
        return () => {
            window.removeEventListener('message', listenMessage);
        };
    }, []);

    return (
            <iframe src={url} style={{width: "100%", height: "100vh"}} frameBorder="0" allowFullScreen/>
    )
}