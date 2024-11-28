'use client';

import styles from "@/app/components/media/videoPlayer.module.css";
import LordIcon from "@/app/components/ui/lordIcon";
import Image from "next/image";
import {useCallback, useEffect, useRef, useState} from "react";
import {useRouter} from "next/navigation";
import Popup from "@/app/components/ui/popup";
import {
    getMediaProgress,
    getMovieDetails,
    getSubtitles, getTvDetails,
    searchSubtitles,
    setMediaProgress
} from "@/app/controller/mediaController";
import DropDown from "@/app/components/ui/dropDown";

export default function VideoPlayer({movieId, links, season = null, episode = null}) {

    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [showPopup, setShowPopup] = useState(false);
    const [popupText, setPopupText] = useState("");
    const [startSavingProgress, setStartSavingProgress] = useState(false);
    const [playPauseAnimation, setPlayPauseAnimation] = useState(null);
    const [selectedQuality, setSelectedQuality] = useState(0);
    const [showSettings, setShowSettings] = useState(false);
    const hideControlsTimeout = useRef(null);
    const [subsSrc, setSubsSrc] = useState(null);
    const [subsList, setSubsList] = useState([]);
    const [subsLoading, setSubsLoading] = useState(false);
    const [showControls, setShowControls] = useState(true);
    const sliderRef = useRef(null);
    const videoRef = useRef(null);
    const playerRef = useRef(null);
    const timecodeRef = useRef(null);
    const [shouldClosePopupRedirect, setShouldClosePopupRedirect] = useState(false);
    const [media, setMedia] = useState(null);



    // Fonction pour afficher les contrôles et réinitialiser le timer d'inactivité
    const showPlayerControls = useCallback(() => {
        setShowControls(true);
        clearTimeout(hideControlsTimeout.current);
        hideControlsTimeout.current = setTimeout(() => setShowControls(false), 3000); // Masque après 3s d'inactivité
    }, []);

    const saveProgress = useCallback(async () => {
        if (videoRef.current && videoRef.current.duration && !videoRef.current.paused) {
            await setMediaProgress(movieId, videoRef.current.currentTime, videoRef.current.duration, season, episode);
        }
    }, [movieId]);

    useEffect(() => {
        season && episode ? getTvDetails(movieId).then((response) => {
            if (response.success) {
                setMedia(response.data);
            }
        }) : getMovieDetails(movieId).then((response) => {
            if (response.success) {
                setMedia(response.data);
            }
        });
    }, []);

    useEffect(() => {
        const intervalId = setInterval(() => {
            if (startSavingProgress) saveProgress();
        }, 5000); // Sauvegarde toutes les 5 secondes

        return () => clearInterval(intervalId);
    }, [saveProgress, startSavingProgress]);

    // Réinitialise le timer d'inactivité lorsqu'il y a interaction avec la souris
    useEffect(() => {
        if (showControls) {
            hideControlsTimeout.current = setTimeout(() => setShowControls(false), 3000);
        }
        return () => clearTimeout(hideControlsTimeout.current);
    }, [showControls]);

    const togglePlayPause = () => {
        if (!videoRef.current || loading) return;

        if (videoRef.current.paused) {
            setLoading(true)
            videoRef.current.play()
                .then(() => {
                    setLoading(false)
                    setPlayPauseAnimation('morph-play-pause');
                })
                .catch((error) => {
                    setLoading(false)
                    setShowPopup(true);
                });
        } else {
            videoRef.current.pause();
            setPlayPauseAnimation('morph-pause-play');
        }
    };

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
            setSubsLoading(true);
            searchSubtitles(movieId, season, episode).then((response) => {
                setSubsList(response.data)
                changeSubsSrc(response.data[0]?.id);
            });
        } else {
            setSubsSrc(null)
        }
    }

    const changeSubsSrc = (id) => {
        setSubsLoading(true);
        getSubtitles(id).then((response) => {
            if (!response.success) {
                setShouldClosePopupRedirect(false);
                setSubsLoading(false);
                setShowPopup(true);
                setPopupText("Une erreur s'est produite lors du chargement des sous-titres")
                return;
            }
            const vttText = response.data;
            const vttBlob = new Blob([vttText], {type: "text/vtt"});
            setSubsSrc(URL.createObjectURL(vttBlob))
            setSubsLoading(false);
        });
    }

    const toggleSettings = () => {
        setShowSettings(!showSettings);
    }

    const handleSliderChange = (event) => {
        videoRef.current.currentTime = event.target.value;
    };

    const handleMouseMove = () => {
        showPlayerControls();
    };

    const handleMouseMoveOnSlider = (event) => {
        if (!videoRef.current || !videoRef.current.duration) return;

        const slider = sliderRef.current;
        const rect = slider.getBoundingClientRect();
        const offsetX = event.clientX - rect.left; // Position de la souris relative à la barre
        const percent = offsetX / rect.width; // Pourcentage du slider
        const time = percent * videoRef.current.duration; // Temps correspondant

        // Mettre à jour le contenu et la position du timecode
        const timecodeElement = timecodeRef.current;
        if (timecodeElement) {
            timecodeElement.textContent = formatTime(time);
            timecodeElement.style.left = `${offsetX+70}px`;
            timecodeElement.style.display = "block";
        }
    };

    const handleMouseLeaveSlider = () => {
        // Cacher le timecode lorsque la souris quitte le slider
        if (timecodeRef.current) {
            timecodeRef.current.style.display = "none";
        }
    };

    const closePopup = () => {
        setShowPopup(false);
        if (shouldClosePopupRedirect) {
            router.back();
        }
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
        <div
            className={styles.player}
            ref={playerRef}
            onMouseMove={handleMouseMove}
        >
            {showPopup ? <Popup title="Erreur" text={popupText} close={closePopup}/> : null}
            <video
                crossOrigin="anonymous"
                ref={videoRef}
                src={links[selectedQuality].link}
                autoPlay
                onLoadStart={() => setLoading(true)}
                onPlaying={() => setLoading(false)} // Lecture commencée
                onWaiting={() => setLoading(true)} // Chargement supplémentaire requis
                onPlay={() => setLoading(true)} // Déclenché lors de la tentative de lecture
                onLoadedData={() => {
                    getMediaProgress(movieId, season, episode).then((progress) => {
                        setStartSavingProgress(true);
                        setLoading(false); // Lecture possible après le préchargement
                        if (progress.success) {
                            videoRef.current.currentTime = progress.data;
                        }
                    });
                }}
                onError={() => {
                    if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
                        setShowPopup(true);
                        setPopupText("Firefox n'est pas compatible avec le format vidéo. Utilise un autre navigateur looser.")
                        setShouldClosePopupRedirect(true);
                    } else {
                        setShouldClosePopupRedirect(true);
                        setShowPopup(true);
                        setPopupText("Une erreur s'est produite lors du chargement de la vidéo");
                    }

                }}
            >
                {subsSrc && (
                    <track
                        kind="subtitles"
                        crossOrigin="anonymous"
                        src={subsSrc}
                        srcLang="fr"
                        label="Français"
                        default
                    />
                )}
            </video>


            <div className={`${styles.playerElements} ${showControls ? "" : styles.hide}`}>
                <button className={`${styles.back} ${styles.playerButton}`} onClick={() => router.back()}>
                    <LordIcon iconName="arrow-white" animationType="hover"/>
                </button>

                <div className={styles.title}>
                    <h1>{media?.title}</h1>
                    <p>{season && episode ? `Saison ${season} - Episode ${episode}` : ""}</p>
                </div>

                <button onClick={togglePlayPause}
                        className={`${styles.playPause} ${loading ? styles.loading : ""} ${styles.playerButton}`}>
                    {loading && <LordIcon iconName="loader-white" animationType="loop"/>}
                    {!videoRef.current?.paused && !loading && (
                        <LordIcon iconName="pause-white" inAnimation={playPauseAnimation} animationType="hover"/>
                    )}
                    {videoRef.current?.paused && !loading && (
                        <LordIcon iconName="play-white" inAnimation={playPauseAnimation} animationType="hover"/>
                    )}
                </button>

                <button className={`${styles.fullscreen} ${styles.playerButton}`} onClick={toggleFullscreen}>
                    <LordIcon iconName="ration-white" animationType="hover"/>
                </button>

                <button className={`${styles.settingsBtn} ${styles.playerButton}`} onClick={toggleSettings}>
                    <LordIcon iconName={"settings-white"} animationType={"hover"}/>
                </button>

                <div className={`${styles.settings} ${showSettings ? styles.show : ""}`}>
                    <div>
                        <p>Qualité</p>
                        <DropDown optionList={links.map((item) => item.quality)} defaultOptionIndex={selectedQuality}
                                  onSelect={(i) => setSelectedQuality(i)}/>
                    </div>
                    <div>
                        <p>Sous-titres</p>
                        <button onClick={toggleSubs}>{
                            subsLoading ? <LordIcon size={20} iconName="loader-white" animationType="loop"/> :
                            subsSrc ? "Désactiver" : "Activer"
                        }</button>
                        {
                            subsSrc && subsList ?
                                <DropDown optionList={subsList.map(item => item.name)} defaultOptionIndex={0}
                                          onSelect={(i) => changeSubsSrc(subsList[i].id)}/>
                                : null
                        }

                    </div>
                </div>

                <div className={styles.positionSlider}>
                    <p>{videoRef.current?.currentTime ? formatTime(videoRef.current.currentTime) : ""}</p>
                    <div className={styles.timecodePreview} ref={timecodeRef}></div>
                    <input
                        ref={sliderRef}
                        type="range"
                        min="0"
                        max={videoRef.current && videoRef.current.duration && videoRef.current.currentTime ? videoRef.current.duration : 100}
                        value={videoRef.current && videoRef.current.duration && videoRef.current.currentTime ? videoRef.current.currentTime : 0}
                        onChange={handleSliderChange}
                        onMouseMove={handleMouseMoveOnSlider}
                        onMouseLeave={handleMouseLeaveSlider}
                    />

                    <p>{videoRef.current?.currentTime ? formatTime(videoRef.current.duration - videoRef.current.currentTime) : ""}</p>
                </div>
            </div>

        </div>
    );
}