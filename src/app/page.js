'use client';

import styles from "@/app/page.module.css";
import LordIcon from "@/app/components/ui/lordIcon";
import {useEffect, useState} from "react";
import Popup from "@/app/components/ui/popup";
import {useRouter} from "next/navigation";
import Image from "next/image";
import {localRecoverUser, login} from "@/app/controller/userController";

export default function Page() {

    const router = useRouter();
    const [pin, setPin] = useState('');
    const [formLoading, setFormLoading] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [popupTitle, setPopupTitle] = useState('');
    const [popupMessage, setPopupMessage] = useState('');

    useEffect(() => {
        localRecoverUser().then(user => {
            if (user) {
                router.push("/home")
            }
        })
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormLoading(true);
        login(pin).then((res) => {
            router.push("/home")
        }).catch((e) => {
            setFormLoading(false);
            setShowPopup(true)
            setPopupTitle('Erreur');
            setPopupMessage(e.message);
        })

    };

    const closePopup = () => {
        setShowPopup(false);
        setPopupTitle('');
        setPopupMessage('');
    }

    return (
        <main className={styles.main}>
            <Image alt="desert" height={1920} width={1080} src="/assets/desert.svg"/>
            {showPopup ? <Popup title={popupTitle} text={popupMessage} close={closePopup}/> : null}
            <form onSubmit={handleSubmit}>
                <h1>Bienvenue sur Alabasta !</h1>
                <label htmlFor={"pin"}>Pour pouvoir acceder a la plateforme, merci de rentrer votre code pin
                    :</label>
                <div>
                    <input autoComplete={"off"} type={"password"} id={"pin"} name={"pin"} required placeholder={"Code Pin"}
                           onChange={(e) => setPin(e.target.value)}></input>
                    <button type="submit" className={"button " + (formLoading ? styles.loading : "")}>
                        <LordIcon iconName={"arrow-white"} animationType={"hover"}/>
                        <LordIcon iconName={"loader-white"} animationType={"loop"}/>
                    </button>
                </div>

            </form>
        </main>
    )
}