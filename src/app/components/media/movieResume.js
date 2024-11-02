"use client";

import Image from "next/image";
import styles from '@/app/components/media/movieResume.module.css';
import {useRouter} from "next/navigation";
import PageLoading from "@/app/components/ui/pageLoading";
import {useState} from "react";
import {localSaveMedia} from "@/app/controller/mediaController";
export default function MovieResume({ movie }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const openMoviePage = async () => {
        setLoading(true);
         localSaveMedia(movie).then(() => {
             router.push("/home/watch/" + movie.id)
         }).catch(() => {
             setLoading(false);
         });

    };
    return (
        <div className={styles.movieResume} onClick={openMoviePage}>
            {loading ? <PageLoading phrase={"enregistrement de la selection..."}/> : ""}
            <Image src={movie.imageUrl} alt={movie.name} width={230} height={345} />
            <p>{movie.name}</p>
            <p>{movie.year}</p>
        </div>
    );

}