import styles from "@/app/components/media/videoPlayer.module.css";
import LordIcon from "@/app/components/ui/lordIcon";
import Image from "next/image";
import {useRef, useState} from "react";
import {useRouter} from "next/navigation";
import Popup from "@/app/components/ui/popup";
import {getSubtitles, searchSubtitles} from "@/app/controller/mediaController";

export default function VideoPlayer({movie, src, changeLinkFctn}) {
    const router = useRouter();
    const [playPauseAnimation, setPlayPauseAnimation] = useState(null);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [subtitles, setSubtitles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showSettings, setShowSettings] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const videoRef = useRef(null);
    const [subsSrc, setSubsSrc] = useState(null);

    const togglePlayPause = () => {
        if (videoRef.current.paused) {
            setPlayPauseAnimation('morph-play-pause')

            videoRef.current.play();
        } else {
            setPlayPauseAnimation('morph-pause-play')
            videoRef.current.pause();
        }
    }

    const toggleSubs = () => {
        if (!subsSrc) {
            setLoading(true);
            searchSubtitles(movie).then((response) => {
                getSubtitles(response.data).then((response) => {
                    setSubsSrc(response.data)
                    setLoading(false);
                });
            });
        } else {
            setSubsSrc(null)
        }
    }

    const handleTimeUpdate = () => {
        if (videoRef.current.duration) {
            setProgress((videoRef.current.currentTime / videoRef.current.duration) * 100);
        }
    };

    const handleSliderChange = (event) => {
        const newTime = (event.target.value / 100) * videoRef.current.duration;
        videoRef.current.currentTime = newTime;
        setProgress(event.target.value);
    };

    const closePopup = () => {
        setShowPopup(false);
        router.push('/home')
    }

    function formatTime(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);

        if (hours > 0) {
            return [
                hours > 9 ? hours : `0${hours}`,
                minutes > 9 ? minutes : `0${minutes}`,
                secs > 9 ? secs : `0${secs}`
            ].join(':');
        } else {
            return [
                minutes > 9 ? minutes : `0${minutes}`,
                secs > 9 ? secs : `0${secs}`
            ].join(':');
        }
    }


    return (
        <div className={styles.player}>
            {showPopup ? <Popup title={"Erreur"} text={"Une erreur s'est produite lors du chargement du film. Veuillez réessayer."} close={closePopup}/> : null}
            <video
                ref={videoRef} src={src}
                autoPlay
                onLoadStart={() => {
                    setLoading(true)
                }}
                onLoadedData={() => {
                    setLoading(false)
                }}
                onWaiting={() => setLoading(true)}
                onPlaying={() => setLoading(false)}
                onTimeUpdate={handleTimeUpdate}
                onError={() => {
                    setShowPopup(true)
                }}
            >

                {
                    subsSrc ?
                        <track
                            kind="subtitles"
                            src={subsSrc}
                            srcLang="fr"
                            label="Français"
                            default
                        /> : ""
                }

            </video>

            <div className={styles.playerElements}>

                <button className={styles.back} onClick={() => router.back()}>
                    <LordIcon iconName={"arrow-white"} animationType={"hover"}/>
                </button>

                <button onClick={togglePlayPause} className={styles.playPause}>
                    {
                        loading ?
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

                <button className={styles.subs} onClick={toggleSubs}>
                    <Image src={"/icons/subtitles.png"} alt={"subs"} width={50} height={50}/>
                </button>

                <div className={`${styles.settings} ${showSettings ? styles.show : ""}`}>
                    {
                        showSettings ?
                            <div>
                                {
                                    movie.qualitiesLinks.map((quality, index) => {
                                        return (
                                            <button key={index} onClick={() => {changeLinkFctn(quality.magnetLink)}}>
                                                {quality.quality}
                                            </button>
                                        )
                                    })
                                }
                                <button onClick={() => setShowSettings(false)}>
                                    <LordIcon iconName={"cross-white"}/>
                                </button>

                            </div> :
                            <button onClick={() => setShowSettings(true)} className={styles.cross}>
                                <LordIcon iconName={"settings-white"}/>
                            </button>

                    }
                </div>

                <div className={styles.positionSlider}>
                    <input

                        type="range"
                        min="0"
                        max="100"
                        value={progress || 0}
                        onChange={handleSliderChange}
                    />
                    <p>
                        {formatTime(videoRef.current?.currentTime)}/{formatTime(videoRef.current?.duration)}
                    </p>
                </div>

            </div>
        </div>
    )
}