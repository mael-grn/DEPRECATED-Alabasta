"use client";

import styles from '@/app/components/media/mediaTile.module.css';
import {useRouter} from "next/navigation";

export default function MediaTile({ media, onClickAction }) {
    const router = useRouter();

    return (
        <div className={styles.movieResume} onClick={onClickAction}>
            <img src={media.poster && media.poster !== "" ? media.poster : "/assets/poster-placeholder.png"} alt={media.title} />
            <p>{media.title}</p>
            <p>{media.year}</p>
        </div>
    );

}