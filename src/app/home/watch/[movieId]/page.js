'use client';
import {useParams, useRouter} from "next/navigation";
import styles from "@/app/home/watch/[movieId]/page.module.css"
import {useEffect, useRef, useState} from "react";
import {initStreamMedia, localRecoverMedia, searchSubtitles} from "@/app/controller/mediaController";
import PageLoading from "@/app/components/ui/pageLoading";
import VideoPlayer from "@/app/components/media/videoPlayer";

export default function Watch() {

    const params = useParams();
    const [movieSrc, setMovieSrc] = useState('');
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        localRecoverMedia(params.movieId).then((movie) => {
            setMovie(movie);
            getLink(movie.qualitiesLinks[0].magnetLink).then(() => {
                setLoading(false);
            });
        });


    },[]);

    const getLink = async (magnet) => {
        initStreamMedia(magnet).then((response) => {
            setMovieSrc(response.data);
        });
    }

    return (
        <div className={styles.watch}>
            {loading && movieSrc ?
                <PageLoading phrase={'Récuperation du lien...'}/> :
                <VideoPlayer movie={movie} src={movieSrc} changeLinkFctn={getLink}/>
            }
        </div>
    );
}