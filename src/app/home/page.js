'use client';

import styles from '@/app/home/page.module.css';

import {
    getMediaDetails,
    getNowPlayingMovies,
    getPopularMovies,
    getTopRatedMovies,
    getUpcomingMovies
} from "@/app/controller/mediaController";

import MediaCarroussel from "@/app/components/media/mediaCarroussel";
import {useEffect, useRef, useState} from "react";
import LordIcon from "@/app/components/ui/lordIcon";
import {useRouter} from "next/navigation";
import Image from "next/image";

export default function Home() {
    const [loading, setLoading] = useState(true);
    const [heroMedia, setHeroMedia] = useState(null);
    const [isScrolled, setIsScrolled] = useState(false);
    const watchBtnRef = useRef(null);
    const [isDarkText, setIsDarkText] = useState(false);

    const router = useRouter();

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 130) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    useEffect(() => {
        getPopularMovies().then((res) => {
            if (res.success) {
                const randomIndex = Math.floor(Math.random() * res.data.length);
                getMediaDetails(res.data[randomIndex].id).then((res) => {
                    setHeroMedia(res.data);
                    setLoading(false);
                    checkImageBrightness(res.data.backdrop).then((isDark) => {
                        setIsDarkText(isDark);

                    });
                });
            }
        });
    }, []);

    const checkImageBrightness = (src) => {
        return new Promise((resolve) => {
            const img = new Image();
            img.src = src;
            img.crossOrigin = "Anonymous"; // Pour éviter les erreurs CORS
            img.onload = () => {
                const canvas = document.createElement("canvas");
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0, img.width, img.height);

                const imageData = ctx.getImageData(0, 0, img.width, img.height);
                const pixels = imageData.data;
                let brightnessSum = 0;

                for (let i = 0; i < pixels.length; i += 4) {
                    const r = pixels[i];
                    const g = pixels[i + 1];
                    const b = pixels[i + 2];
                    const brightness = (r * 0.299 + g * 0.587 + b * 0.114);
                    brightnessSum += brightness;
                }

                const avgBrightness = brightnessSum / (pixels.length / 4);
                resolve(avgBrightness < 128); // Si luminosité < 128, l'image est sombre
            };
        });
    };

    const openHeroMedia = () => {
        router.push("/home/media/" + heroMedia.id);
    }

    const watchHeroMedia = () => {
        router.push("/home/watch/" + heroMedia.id);
    }

    return (
        <div className={styles.homeContainer}>
            {!heroMedia ? null :
                <Image className={`${styles.bgImage} ${isScrolled ? styles.bgImageHide : null}`} src={heroMedia.backdrop} alt={"backdrop"} width={1280} height={496}/>}
            <div className={`${styles.home} ${isScrolled || !heroMedia ? null : styles.onTop}`}>
                {
                    loading ?
                        <div className={styles.heroMovieLoading}>
                            <LordIcon iconName={"loader-white"} animationType={"loop"}/>
                        </div> :
                        (
                            heroMedia ?
                                <div className={`${styles.heroMovie} ${isDarkText ? null : styles.dark}`}>
                                    <Image src={heroMedia.backdrop} alt={heroMedia.title} width={1280} height={496}/>
                                    <div className={styles.heroMovieInfo}>
                                        <h1>{heroMedia.title}</h1>
                                        <div className={styles.genreTag}>
                                            {
                                                heroMedia.genres.map((genre) => {
                                                    return <p>{genre}</p>
                                                })
                                            }
                                        </div>
                                        <p className={styles.overview}>{heroMedia.overview.length > 100
                                            ? heroMedia.overview.slice(0, 200) + '...'
                                            : heroMedia.overview}</p>
                                        <div className={styles.btnDiv}>
                                            <button className={styles.btnWatch} onMouseEnter={() => {
                                                        if (watchBtnRef) watchBtnRef.current.triggerAnimation()
                                                    }} onClick={watchHeroMedia}>
                                                Regarder
                                                <LordIcon ref={watchBtnRef} iconName={"play-white"}
                                                          animationType={"hover"}/>
                                            </button>
                                            <button className={styles.btnInfo} onClick={openHeroMedia}>
                                                <LordIcon iconName={"info-white"} animationType={"hover"}/>
                                            </button>
                                        </div>
                                    </div>

                                </div> : null
                        )
                }
                <MediaCarroussel mediaListFctn={getPopularMovies} title={"Films populaires"}/>
                <MediaCarroussel mediaListFctn={getNowPlayingMovies} title={"En ce moment au cinéma"}/>
                <MediaCarroussel mediaListFctn={getTopRatedMovies} title={"Films les mieux notés"}/>
                <MediaCarroussel mediaListFctn={getUpcomingMovies} title={"Films bientôt disponibles"}/>
            </div>

        </div>

    );
}
