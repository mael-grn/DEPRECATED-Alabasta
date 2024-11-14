'use client';
import {useParams} from "next/navigation";
import styles from "@/app/home/watch/[mediaId]/page.module.css"
import {useEffect, useState} from "react";
import {fetchProxy} from "@/app/utils/fetchProxy";
import PageLoading from "@/app/components/ui/pageLoading";

export default function Watch() {
    const params = useParams();
    const [loading, setLoading] = useState(true);
    const [htmlContent, setHtmlContent] = useState(null);

    return (
            <div className={styles.watch}>
                <iframe loading={"lazy"} src={"https://vidsrc.xyz/embed/movie/" + params.mediaId} allowFullScreen={true}></iframe>
            </div>
    );
}