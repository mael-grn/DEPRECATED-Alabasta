'use client';

import styles from '@/app/home/page.module.css';

import {
    getContinueWatching,
    getMovieDetails,
    getNowPlayingMovies,
    getPopularMovies,
    getTopRatedMovies
} from "@/app/controller/mediaController";

import MediaCarroussel from "@/app/components/media/mediaCarroussel";
import {useEffect, useRef, useState} from "react";
import LordIcon from "@/app/components/ui/lordIcon";
import {useRouter} from "next/navigation";
import {localRecoverUser} from "@/app/controller/userController";
import MediaDetails from "@/app/components/media/mediaDetails";

export default function Home() {
    const [loading, setLoading] = useState(true);
    const [heroMedia, setHeroMedia] = useState(null);
    const watchBtnRef = useRef(null);
    const [isDarkText, setIsDarkText] = useState(false);
    const [isDemoUser, setIsDemoUser] = useState(false);
    const [showDetails, setShowDetails] = useState(null);

    const router = useRouter();


    useEffect(() => {
        localRecoverUser().then((user) => {
            if (user && user.id === 3) {
                setIsDemoUser(true);
            }
        });
        getPopularMovies().then((res) => {
            if (res.success) {
                const randomIndex = Math.floor(Math.random() * res.data.length);
                getMovieDetails(res.data[randomIndex].id).then((res) => {
                    setHeroMedia(res.data);
                    setLoading(false);
                    setIsDarkText(true);
                });
            }
        });
    }, []);

    const openHeroMedia = () => {
        setShowDetails(heroMedia);
    }

    const watchHeroMedia = () => {
        switch (heroMedia.type) {
            case "movie":
                router.push("/watch/" + heroMedia.id);
                break;
            case "tv":
                router.push("/watch/" + heroMedia.id + "/1/1");
                break;
            default:
                break;
        }
    }

    return (
        <div className={styles.homeContainer}>
            {
                showDetails ? <MediaDetails media={showDetails} closeAction={() => setShowDetails(null)}/> : null
            }
            <div className={`${styles.home}`}>
                {
                    loading ?
                        <div className={styles.heroMovieLoading}>
                            <LordIcon iconName={"loader-white"} animationType={"loop"}/>
                        </div> :
                        (
                            heroMedia ?
                                <div className={`${styles.heroMovie} ${isDarkText ? null : styles.dark}`}>
                                    <img src={heroMedia.backdrop} alt={heroMedia.title}/>
                                    <div className={styles.heroMovieInfo}>
                                        <h1>{heroMedia.title}</h1>

                                        <div className={styles.btnDiv}>
                                            {
                                                isDemoUser ? null :
                                                    <button className={styles.btnWatch} onMouseEnter={() => {
                                                        if (watchBtnRef) watchBtnRef.current.triggerAnimation()
                                                    }} onClick={watchHeroMedia}>
                                                        Regarder
                                                        <LordIcon ref={watchBtnRef} iconName={"play-white"}
                                                                  animationType={"hover"}/>
                                                    </button>
                                            }

                                            <button className={styles.btnInfo} onClick={openHeroMedia}>
                                                <LordIcon iconName={"info-white"} animationType={"hover"}/>
                                            </button>
                                        </div>
                                    </div>

                                </div> : null
                        )
                }
                {
                    isDemoUser ? null :
                        <MediaCarroussel mediaListFctn={getContinueWatching} title={"Continuer la lecture"}/>
                }
                <MediaCarroussel mediaListFctn={getPopularMovies} title={"Films populaires"}/>
                <MediaCarroussel mediaListFctn={getNowPlayingMovies} title={"En ce moment au cinéma"}/>
                <MediaCarroussel mediaListFctn={getTopRatedMovies} title={"Films les mieux notés"}/>
            </div>

        </div>

    );
}
