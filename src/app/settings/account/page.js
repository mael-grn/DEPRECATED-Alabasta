"use client"

import BackButton from "@/app/components/ui/backButton";
import defaultStyles from "@/app/settings/settingsPageBase.module.css"
export default function Account() {
    return (
        <div className={defaultStyles.settingsPage}>
            <BackButton/>
            <h1>Mon compte</h1>
            <p>Retrouvez ici tous les paramètres qui concernent votre compte sur Alabasta.</p>
            <div>

            </div>
        </div>
    )
}