"use client"

import BackButton from "@/app/components/ui/backButton";
import defaultStyles from "@/app/settings/settingsPageBase.module.css"
import WarningMessage from "@/app/components/ui/warningMessage";
import {useEffect, useState} from "react";
import DropDown from "@/app/components/ui/dropDown";
import {
    getUserPreferredSource,
    possibleSourceName,
    possibleSources,
    setUsersPreferredSource
} from "@/app/controller/settingsController";
import LordIcon from "@/app/components/ui/lordIcon";

export default function Player() {

    const [usedPlayerIndex, setUsedPlayerIndex] = useState(0)
    const [usedPlayerLoading, setUsedPlayerLoading] = useState(true)

    useEffect(() => {
        getUserPreferredSource().then((res) => {
            setUsedPlayerLoading(false)
            setUsedPlayerIndex(possibleSourceName.indexOf(res.name) ? possibleSourceName.indexOf(res.name) : 0);
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
            <BackButton /*left={window.innerWidth < 600 ? "20px" : "110px"}*//>
            <h1>Lecteur et source</h1>
            <p>Personnalisez et modifiez les option du lecteur et de la srouce.</p>
            <div className={defaultStyles.settingsOption}>
                <p>Source :</p>
                <div>
                    {
                        usedPlayerLoading ? <LordIcon iconName={"loader-white"} animationType={"loop"}/> :
                            <DropDown defaultOptionIndex={usedPlayerIndex} onSelect={changeUsedPlayer} optionList={possibleSourceName}/>
                    }
                </div>
            </div>
        </div>
    )
}