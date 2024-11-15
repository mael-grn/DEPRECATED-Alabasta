'use client';
import {useParams} from "next/navigation";
import styles from "@/app/watch/[mediaId]/page.module.css"

export default function Watch() {
    const params = useParams();

    return (
            <div className={styles.watch}>
                <iframe loading={"lazy"} src={"https://vidsrc.xyz/embed/movie/" + params.mediaId} allowFullScreen={true}></iframe>
            </div>
    );
}