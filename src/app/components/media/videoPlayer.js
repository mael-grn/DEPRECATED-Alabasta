import styles from "@/app/components/media/videoPlayer.module.css";
import LordIcon from "@/app/components/ui/lordIcon";
import Image from "next/image";
import {useRef, useState} from "react";
import {useRouter} from "next/navigation";
import Popup from "@/app/components/ui/popup";

export default function VideoPlayer({src}) {
    const router = useRouter();
    const [playPauseAnimation, setPlayPauseAnimation] = useState(null);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [subtitles, setSubtitles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showPopup, setShowPopup] = useState(false);
    const videoRef = useRef(null);

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

    const closePopup = () => {
        setShowPopup(false);
        router.push('/home')
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
                onTimeUpdate={handleTimeUpdate}
                onError={() => setShowPopup(true)}
            >
                {subtitles.map((subtitle, index) => (
                    <track
                        key={index}
                        label={subtitle.language} // Nom de la langue des sous-titres
                        kind="subtitles" // Type de piste
                        src={subtitle.url} // URL des sous-titres
                        default // Affiche par défaut les sous-titres
                    />
                ))}
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
        </div>
    )
}