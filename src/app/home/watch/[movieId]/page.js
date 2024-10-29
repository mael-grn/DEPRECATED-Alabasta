'use client';
import {useParams} from "next/navigation";
import styles from "@/app/home/watch/[movieId]/page.module.css"
import {useEffect, useState} from "react";
import {recoverMovieData} from "@/app/controller/movieController";
import {getMovieDetails, streamMovie} from "@/app/utils/queryUtils";
export default function Watch() {
    const params = useParams();
    const [movieSrc, setMovieSrc] = useState('');

    useEffect(() => {
        recoverMovieData(params.movieId).then((movie) => {
            getMovieDetails(movie.pageUrl).then((response) => {
                streamMovie(response.data[0].magnetLink).then((response) => {
                    setMovieSrc(response.data);
                });

            })
        });



    },[]);

    return (
        <div className={styles.watch}>
            <h1>Watch {params.movieId}</h1>
            <video src={movieSrc} controls autoPlay />
        </div>
    );
}