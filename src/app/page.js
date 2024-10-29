'use client';

import styles from "@/app/page.module.css";
import LordIcon from "@/app/components/lordIcon";
import {login} from "@/app/utils/queryUtils";
import {useEffect, useState} from "react";
import Popup from "@/app/components/popup";
import {useRouter} from "next/navigation";
import Image from "next/image";
import {recoverUserData} from "@/app/controller/userController";

export default function Page() {

    const router = useRouter();
    const [pin, setPin] = useState('');
    const [formLoading, setFormLoading] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [popupTitle, setPopupTitle] = useState('');
    const [popupMessage, setPopupMessage] = useState('');

    useEffect(() => {
        recoverUserData().then(user => {
            if (user) {
                router.push("/home")
            }
        })
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormLoading(true);

        login(pin).then((res) => {
            setFormLoading(false);
            if (res.success) {
                router.push("/home")
            } else {
                setShowPopup(true)
                setPopupTitle('Erreur');
                setPopupMessage(res.errorType);
            }
        });

    };

    const closePopup = () => {
        setShowPopup(false);
        setPopupTitle('');
        setPopupMessage('');
    }

    return (
        <main className={styles.main}>
            <Image alt="background" height={2912} width={1632} src="/assets/desert.jpg"/>
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