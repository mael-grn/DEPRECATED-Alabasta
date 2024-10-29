'use client';

import {useEffect, useRef, useState} from "react";
import Popup from "@/app/components/popup";
import Image from "next/image";
import styles from '@/app/home/page.module.css';
import {getMovieDetails, getPopularMovies, searchMovie} from "@/app/utils/queryUtils";
import VideoPlayer from "@/app/components/videoPlayer";
import Movie from "@/app/model/movie";
import MovieResume from "@/app/components/movieResume";
import LordIcon from "@/app/components/lordIcon";
import PageLoading from "@/app/components/pageLoading";

export default function Home() {
    const [showPopup, setShowPopup] = useState(false);
    const [popupTitle, setPopupTitle] = useState('');
    const [popupMessage, setPopupMessage] = useState('');
    const [popularMovies, setPopularMovies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [heroMovie, setHeroMovie] = useState(null);
    const popularMovieListRef = useRef(null); // Crée une référence pour la div
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {

        const handleScroll = () => {
            if (window.scrollY > 50) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const closePopup = () => {
        setShowPopup(false);
        setPopupTitle('');
        setPopupMessage('');
    }

    const scrollMovieList = (movieListRef, scrollAmount) => {
        console.log((popularMovieListRef.current.scrollLeft + popularMovieListRef.current.clientWidth) <= (popularMovieListRef.current.scrollWidth - 5))
        // Déclenche le défilement horizontal
        if (movieListRef.current) {
            movieListRef.current.scrollBy({
                left: scrollAmount, // Offset de défilement
                behavior: "smooth"  // Défilement fluide
            });
        }
    };

    useEffect(() => {
        setLoading(true);
        getPopularMovies().then((response) => {
            setLoading(false);
            if (response.success) {
                let movies = [];
                for (let item of response.data) {
                    movies.push(new Movie( item.item.image, item.item.name, item.item.url))
                }
                setPopularMovies(movies);
                setHeroMovie(movies[Math.floor(Math.random() * movies.length)]);
            }
            else {
                setPopupTitle('Erreur');
                setPopupMessage('Impossible de charger les films populaires');
                setShowPopup(true);
            }
        });
    },[]);

    return (
        <div className={`${styles.home} ${scrolled ? styles.scrolled : ""}`}>
            {showPopup ? <Popup title={popupTitle} text={popupMessage} close={closePopup}/> : null}

            {
                heroMovie ?
                    <Image className={styles.bgImage} src={heroMovie?.imageUrl || ""} alt={heroMovie?.name} width={230} height={345}/>
                    : ""
            }
            {
                loading ?
                    <PageLoading/>
                    :
                    <div>
                        {
                            heroMovie ?
                                <div className={styles.heroMovie}>
                                    <Image src={heroMovie?.imageUrl || ""} alt={heroMovie?.name} width={230}
                                           height={345}/>
                                    <h2>{heroMovie?.name}</h2>
                                </div>
                                : ""
                        }
                        <div className={styles.movieListSection}>
                            <h1>Films populaires</h1>
                            <div className={styles.movieList} ref={popularMovieListRef}>
                                {
                                    popularMovies.map(
                                        (movie) => {
                                            return (
                                                <MovieResume movie={movie}/>
                                            );
                                        }
                                    )
                                }
                            </div>
                            <button onClick={() => scrollMovieList(popularMovieListRef, 325)} className={styles.rightButton}><LordIcon
                                iconName={"circleArrow-white"} animationType={"hover"}/></button>
                            <button onClick={() => scrollMovieList(popularMovieListRef, -325)} className={styles.leftButton}><LordIcon
                                iconName={"circleArrow-white"} animationType={"hover"}/></button>

                        </div>

                    </div>

            }
        </div>
    );
}
