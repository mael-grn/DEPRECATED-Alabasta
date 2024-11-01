'use client';
import {useParams, useRouter} from "next/navigation";
import styles from "@/app/home/watch/[movieId]/page.module.css"
import {useEffect, useRef, useState} from "react";
import {recoverMovieData} from "@/app/controller/movieController";
import {getMovieDetails, streamMovie} from "@/app/utils/queryUtils";
import PageLoading from "@/app/components/pageLoading";
import LordIcon from "@/app/components/lordIcon";
import Image from "next/image";

export default function Watch() {

    const router = useRouter();
    const params = useParams();
    const [movieSrc, setMovieSrc] = useState('');
    const [loading, setLoading] = useState(true);
    const [playerLoading, setPlayerLoading] = useState(false);
    const [playPauseAnimation, setPlayPauseAnimation] = useState(null);
    const [loadingMessage, setLoadingMessage] = useState('Récuperation du lien...');
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);

    const videoRef = useRef(null);

    useEffect(() => {
        setLoading(true);
        recoverMovieData(params.movieId).then((movie) => {
            getMovieDetails(movie.pageUrl).then((response) => {
                streamMovie(response.data[0].magnetLink).then((response) => {
                    setMovieSrc(response.data);
                });

            })
        });

    },[]);

    const togglePlayPause = () => {
        if (videoRef.current.paused) {
            setPlayPauseAnimation('morph-play-pause')

            videoRef.current.play();
        } else {
            setPlayPauseAnimation('morph-pause-play')
            videoRef.current.pause();
        }
    }

    const handleTimeUpdate = () => {
        setProgress((videoRef.current.currentTime / videoRef.current.duration) * 100);
    };

    const handleSliderChange = (event) => {
        const newTime = (event.target.value / 100) * videoRef.current.duration;
        videoRef.current.currentTime = newTime;
        setProgress(event.target.value);
    };

    return (
        <div className={styles.watch}>
            {loading ? <PageLoading phrase={loadingMessage}/> : null}
            <video
                ref={videoRef} src={movieSrc}
                autoPlay
                onLoadStart={() => {
                    setLoadingMessage("Initilisation du streaming...")

                }}
                onLoadedData={() => {
                    setLoading(false)
                }}
                onTimeUpdate={handleTimeUpdate}
            />
            {
                !loading ?
                    <div className={styles.player}>

                        <button className={styles.back} onClick={() => router.back()}>
                            <LordIcon iconName={"arrow-white"} animationType={"hover"}/>
                        </button>

                        <button onClick={togglePlayPause} className={styles.playPause}>
                            {
                                playerLoading ?
                                    <LordIcon iconName={"loader-white"} animationType={"loop"}/> : ""
                            }
                            {
                                !videoRef.current?.paused && !loading ?
                                    <LordIcon iconName={"pause-white"} inAnimation={playPauseAnimation}
                                              animationType={"hover"}/> : ""
                            }
                            {
                                videoRef.current?.paused && !loading ?
                                    <LordIcon iconName={"play-white"} inAnimation={playPauseAnimation}
                                              animationType={"hover"}/> : ""
                            }
                        </button>

                        <button className={styles.subs}>
                            <Image src={"/icons/subtitles.png"} alt={"subs"} width={50} height={50}/>
                        </button>

                        <div className={styles.positionSlider}>
                            <input

                                type="range"
                                min="0"
                                max="100"
                                value={progress}
                                onChange={handleSliderChange}
                            />
                        </div>

                    </div>
                    : ""
            }

        </div>
    );
}