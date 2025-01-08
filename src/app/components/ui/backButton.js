import LordIcon from "@/app/components/ui/lordIcon";
import {useRouter} from "next/navigation";
import styles from "@/app/components/ui/backButton.module.css";

export default function BackButton({top = "20px", left = "110px"}) {
    const router = useRouter();
    return (
        <div onClick={() => router.back()} className={styles.backButton} style={{top: top, left: left}}>
            <LordIcon iconName={"arrow-white"} animationType={"hover"}/>
        </div>
    )
}