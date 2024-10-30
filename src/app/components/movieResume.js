"use client";

import Image from "next/image";
import styles from '@/app/components/movieResume.module.css';
import {useRouter} from "next/navigation";
import {saveMovieData} from "@/app/controller/movieController";
import PageLoading from "@/app/components/pageLoading";
import {useState} from "react";
export default function MovieResume({ movie }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const openMoviePage = async () => {
        setLoading(true);
         saveMovieData(movie).then(() => {
             setLoading(false);
             router.push("/home/watch/" + movie.id)
         })

    };
    return (
        <div className={styles.movieResume} onClick={openMoviePage}>
            {loading ? <PageLoading/> : ""}
            <Image src={movie.imageUrl} alt={movie.name} width={230} height={345} />
            <p>{movie.name}</p>
            <p>{movie.year}</p>
        </div>
    );

}