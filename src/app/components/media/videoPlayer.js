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
    const [selectedQuality, setSelectedQuality] = useState(0);
    const [loading, setLoading] = useState(true);
    const [showSettings, setShowSettings] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [popupText, setPopupText] = useState("");
    const videoRef = useRef(null);
    const playerRef = useRef(null);
    const [subsSrc, setSubsSrc] = useState(null);

    const togglePlayPause = () => {
        if (videoRef.current.paused && !loading) {
            setPlayPauseAnimation('morph-play-pause')

            videoRef.current.play();
        } else {
            setPlayPauseAnimation('morph-pause-play')
            videoRef.current.pause();
        }
    }

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            playerRef.current.requestFullscreen().catch(err => {
                setShowPopup(true);
                setPopupText(`Erreur lors du passage en plein écran: ${err.message}`);
            });
        } else {
            document.exitFullscreen();
        }
    };

    const toggleSubs = () => {
        if (!subsSrc) {
            setLoading(true);
            videoRef.current.pause();
            searchSubtitles(movie).then((response) => {
                getSubtitles(response.data).then((response) => {
                    if (!response.success) {
                        setLoading(false);
                        setShowPopup(true);
                        setPopupText("Une erreur s'est produite lors du chargement des sous-titres")
                        return;
                    }
                    const vttText = response.data;
                    const vttBlob = new Blob([vttText], { type: "text/vtt" });
                    setSubsSrc(URL.createObjectURL(vttBlob))
                    setLoading(false);
                    videoRef.current.play();
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
        <div className={styles.player} ref={playerRef}>
            {showPopup ? <Popup title={"Erreur"} text={popupText} close={closePopup}/> : null}
            <video
                crossOrigin="anonymous"
                ref={videoRef} src={src}
                autoPlay
                onLoad={() => {
                    
                }}
                onLoadStart={() => {
                    setLoading(true)
                }}
                onLoadedData={() => {
                    setLoading(false)
                }}
                onWaiting={() => {
                    setLoading(true)
                    videoRef.current.pause()
                }}
                onPlaying={() => setLoading(false)}
                onTimeUpdate={handleTimeUpdate}
                onError={() => {
                    setShowPopup(true)
                    setPopupText("Une erreur s'est produite lors du chargement de la vidéo")
                }}
            >

                {
                    subsSrc ?
                        <track
                            kind={"subtitles"}
                            crossOrigin="anonymous"
                            src={subsSrc}
                            srcLang={"fr"}
                            label={"Français"}
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

                <button className={`${styles.subs} ${subsSrc ? styles.activated : ""}`} onClick={toggleSubs}>
                    <Image src={"/icons/subtitles.png"} alt={"subs"} width={50} height={50}/>
                </button>

                <button className={styles.fullscreen} onClick={toggleFullscreen}>
                    <LordIcon iconName={"ration-white"} animationType={"hover"}/>
                </button>

                <div className={`${styles.settings} ${showSettings ? styles.show : ""}`}>
                    {
                        showSettings ?
                            <div>
                                {
                                    movie.qualitiesLinks.map((quality, index) => {
                                        return (
                                            <button className={selectedQuality === index ? styles.selected : ""} key={index} onClick={() => {
                                                setSelectedQuality(index)
                                                changeLinkFctn(quality.magnetLink)
                                            }}>
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
                        {
                            videoRef.current ?
                                formatTime(videoRef.current.duration - videoRef.current.currentTime) : ""
                        }
                    </p>
                </div>

            </div>
        </div>
    )
}