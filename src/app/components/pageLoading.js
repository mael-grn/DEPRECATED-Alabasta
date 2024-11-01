'use client';
import LordIcon from "@/app/components/lordIcon";
import styles from "@/app/components/pageLoading.module.css";
import { useEffect } from "react";

export default function PageLoading({ phrase = "" }) {
    return (
        <div className={styles.loadingPage}>
            <div>
                <LordIcon iconName={"loader-white"} animationType={"loop"} />
            </div>
            {
                phrase === "" ? null : <p key={phrase}>{phrase}</p>
            }
        </div>
    );
}
