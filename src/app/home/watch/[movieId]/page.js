'use client';
import {useParams} from "next/navigation";
import styles from "@/app/home/watch/[movieId]/page.module.css"
import {useEffect, useState} from "react";
import {recoverMovieData} from "@/app/controller/movieController";
import {getMovieDetails, streamMovie} from "@/app/utils/queryUtils";
import PageLoading from "@/app/components/pageLoading";
export default function Watch() {
    const params = useParams();
    const [movieSrc, setMovieSrc] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        recoverMovieData(params.movieId).then((movie) => {
            getMovieDetails(movie.pageUrl).then((response) => {
                streamMovie(response.data[0].magnetLink).then((response) => {
                    setLoading(false);
                    setMovieSrc(response.data);
                });

            })
        });

    },[]);

    return (
        <div className={styles.watch}>
            {loading ? <PageLoading phrase={"Récuperation du lien..."}/> : null}
            <video src={movieSrc} controls autoPlay />
        </div>
    );
}