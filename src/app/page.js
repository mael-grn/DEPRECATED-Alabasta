'use client';

import {useState} from "react";
import Popup from "@/app/components/popup";

export default function Home() {
    const [showPopup, setShowPopup] = useState(false);
    const [popupTitle, setPopupTitle] = useState('');
    const [popupMessage, setPopupMessage] = useState('');

    const closePopup = () => {
        setShowPopup(false);
        setPopupTitle('');
        setPopupMessage('');
    }

    return (
        <div>
            {showPopup ? <Popup title={popupTitle} text={popupMessage} close={closePopup}/> : null}
            <Image alt={"background"} height={1920} width={1080} src={"./assets/desert.jpg"}/>
            HOME
        </div>
    );
}
