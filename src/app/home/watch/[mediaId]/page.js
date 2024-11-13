'use client';
import {useParams} from "next/navigation";
import styles from "@/app/home/watch/[mediaId]/page.module.css"

export default function Watch() {

    const params = useParams();

    return (
        <div className={styles.watch}>
            <iframe src={"https://vidsrc.xyz/embed/movie/" + params.mediaId} allowFullScreen={true}/>
        </div>
    );
}