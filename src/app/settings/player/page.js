"use client"

import BackButton from "@/app/components/ui/backButton";
import defaultStyles from "@/app/settings/settingsPageBase.module.css"
import WarningMessage from "@/app/components/ui/warningMessage";
import {useEffect, useState} from "react";
import DropDown from "@/app/components/ui/dropDown";
import {getUserPreferredSource, possibleSources, setUsersPreferredSource} from "@/app/controller/settingsController";
import LordIcon from "@/app/components/ui/lordIcon";

export default function Player() {

    const [usedPlayerIndex, setUsedPlayerIndex] = useState(0)
    const [usedPlayerLoading, setUsedPlayerLoading] = useState(true)

    useEffect(() => {
        getUserPreferredSource().then((res) => {
            setUsedPlayerLoading(false)
            setUsedPlayerIndex(possibleSources.indexOf(res) ? possibleSources.indexOf(res) : 0);
        });
    }, []);

    const changeUsedPlayer = (index) => {
        setUsersPreferredSource(possibleSources[index]).then(() => {
            setUsedPlayerIndex(index);
        }).catch((e) => {
          console.log(e)
        })
    }
    return (
        <div className={defaultStyles.settingsPage}>
            <BackButton/>
            <h1>Lecteur et source</h1>
            <p>Personnalisez et modifiez les option du lecteur et de la srouce.</p>
            <div className={defaultStyles.settingsOption}>
                <p>Source :</p>
                <div>
                    {
                        usedPlayerLoading ? <LordIcon iconName={"loader-white"} animationType={"loop"}/> :
                            <DropDown defaultOptionIndex={usedPlayerIndex} onSelect={changeUsedPlayer} optionList={possibleSources}/>

                    }
                    {
                        !usedPlayerLoading && usedPlayerIndex === 1 && <WarningMessage message={"Bien que plus complet, cette source contient également des publicités, parfois NSFW. Si lors d'un clique sur le lecteur une nouvelle page s'ouvre, la fermer immédiatement."}/>
                    }
                    {
                        !usedPlayerLoading && usedPlayerIndex === 2 && <WarningMessage message={"Bien que plus complet, cette source ne permet pas de sauvegarder la progression de la lecture des films et séries."}/>
                    }
                </div>
            </div>
        </div>
    )
}