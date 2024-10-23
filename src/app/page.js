'use client';

import {useEffect, useState} from "react";
import {recoverUserData} from "@/app/controller/userController";
import PageLoading from "@/app/components/pageLoading";
import {login} from "@/app/utils/queryUtils";
import Popup from "@/app/components/popup";
import styles from "@/app/login/page.module.css";
import LordIcon from "@/app/components/lordIcon";

export default function Home() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [pin, setPin] = useState('');
    const [formLoading, setFormLoading] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [popupTitle, setPopupTitle] = useState('');
    const [popupMessage, setPopupMessage] = useState('');


    useEffect(() => {
        setLoading(true);
        recoverUserData().then((res) => {
            setLoading(false);
            if (res) setUser(res);
        });
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormLoading(true);

        login(pin).then((res) => {
            setFormLoading(false);
            if (res.success) {
                setUser(res.data);
            } else {
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

        <div>
            {loading ? <PageLoading/> : null}
            {showPopup ? <Popup title={popupTitle} text={popupMessage} close={closePopup}/> : null}

            <Image alt={"background"} height={1920} width={1080} src={"./assets/desert.jpg"}/>
            {
                user ?
                    <div>
                        CONNECTED
                    </div>
                    :
                    <form onSubmit={handleSubmit}>
                        <h1>Bienvenue sur Alabasta !</h1>
                        <label htmlFor={"pin"}>Pour pouvoir acceder a la plateforme, merci de rentrer votre code pin
                            :</label>
                        <input type={"password"} id={"pin"} name={"pin"} required placeholder={"Code Pin"}></input>
                        <button type="submit" className={"button " + (formLoading ? styles.loading : undefined)}>
                            <LordIcon iconName={"loader-white"} animationType={"loop"}/>
                            <p>Connexion</p>
                        </button>
                    </form>
            }

        </div>
    );
}
