'use client';
import {useParams, useRouter} from "next/navigation";
import styles from "@/app/home/watch/[movieId]/page.module.css"
import {useEffect, useRef, useState} from "react";
import {initStreamMedia, localRecoverMedia} from "@/app/controller/mediaController";
import PageLoading from "@/app/components/ui/pageLoading";
import VideoPlayer from "@/app/components/media/videoPlayer";

export default function Watch() {

    const params = useParams();
    const [movieSrc, setMovieSrc] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        localRecoverMedia(params.movieId).then((movie) => {
            initStreamMedia(movie).then((response) => {
                setMovieSrc(response.data);
                setLoading(false);
            });
        });

    },[]);



    return (
        <div className={styles.watch}>
            {loading ?
                <PageLoading phrase={'Récuperation du lien...'}/> :
                <VideoPlayer src={movieSrc}/>
            }
        </div>
    );
}