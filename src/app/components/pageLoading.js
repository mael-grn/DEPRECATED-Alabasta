import Image from "next/image";
import LordIcon from "@/app/components/lordIcon";
import styles from "@/app/components/pageLoading.module.css";
export default function PageLoading() {
    return (
        <div className={styles.loadingPage}>
            <div><LordIcon iconName={"loader-white"} animationType={"loop"}/></div>
        </div>
    )
}