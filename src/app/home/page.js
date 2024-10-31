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
    const [loading, setLoading] = useState(true);
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

    useEffect(() => {
        getPopularMovies().then((response) => {
            setLoading(false);
            if (response.success) {

                setPopularMovies(response.data);
            } else {
                setPopupTitle('Erreur');
                setPopupMessage('Impossible de charger les films populaires');
                setShowPopup(true);
            }
        });
    }, []);

    const closePopup = () => {
        setShowPopup(false);
        setPopupTitle('');
        setPopupMessage('');
    }

    const scrollMovieList = (movieListRef, scrollAmount) => {
        // Déclenche le défilement horizontal
        if (movieListRef.current) {
            movieListRef.current.scrollBy({
                left: scrollAmount, // Offset de défilement
                behavior: "smooth"  // Défilement fluide
            });
        }
    };




    return (
        <div className={`${styles.home} ${scrolled ? styles.scrolled : ""}`}>
            {showPopup ? <Popup title={popupTitle} text={popupMessage} close={closePopup}/> : null}

            {
                loading ?
                    <PageLoading phrase={"Récupération des films populaires..."}/>
                    :
                    <div>
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
