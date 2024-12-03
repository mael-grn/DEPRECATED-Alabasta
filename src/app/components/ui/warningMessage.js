import styles from "@/app/components/ui/warningMessage.module.css"
import LordIcon from "@/app/components/ui/lordIcon";

export default function WarningMessage({message}) {
    return (
        <div className={styles.warningMessage}>
            <LordIcon iconName={"warning-black"}/>
            <p>{message}</p>
        </div>
    )

}