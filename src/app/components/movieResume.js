import Image from "next/image";
import styles from '@/app/components/movieResume.module.css';
import {useRouter} from "next/navigation";
import {saveMovieData} from "@/app/controller/movieController";
export default function MovieResume({ movie }) {
    const router = useRouter();

    const openMoviePage = async () => {
         await saveMovieData(movie);
        router.push("/home/watch/" + movie.id)
    };
    return (
        <div className={styles.movieResume} onClick={openMoviePage}>
            <Image src={movie.imageUrl} alt={movie.name} width={230} height={345} />
            <p>{movie.name}</p>
        </div>
    );

}