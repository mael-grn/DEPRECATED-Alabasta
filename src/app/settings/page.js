import Link from "next/link";
import styles from "@/app/settings/page.module.css"
export default function Settings() {
    return (
        <div className={styles.settings}>
            <h1>Paramètres</h1>
            <div>
                <ul>
                    <Link href={"/settings/account/"}>Mon compte</Link>
                    <Link href={"/settings/player/"}>Lecteur et source</Link>
                </ul>
            </div>
        </div>
    )
}