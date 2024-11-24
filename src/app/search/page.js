"use client"

import Image from "next/image";
import styles from "@/app/search/page.module.css";
import Popup from "@/app/components/ui/popup";
import LordIcon from "@/app/components/ui/lordIcon";
import {useEffect, useRef, useState} from "react";
import MediaTile from "@/app/components/media/mediaTile";
import {searchMedia} from "@/app/controller/mediaController";
import MediaDetails from "@/app/components/media/mediaDetails";
import {addToHistory, getHistory} from "@/app/controller/userController";

export default function Search() {

    const [searchValue, setSearchValue] = useState('');
    const [formLoading, setFormLoading] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [popupTitle, setPopupTitle] = useState('');
    const [popupMessage, setPopupMessage] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [showDetails, setShowDetails] = useState(null);
    const [history, setHistory] = useState([]);
    const inputRef = useRef(null);

    useEffect(() => {
        getHistory().then((res) => {
            if (res.success) {
                if (res.data.length > 0) setHistory(res.data);
            }
        });
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!searchValue) {
            setShowPopup(true)
            setPopupTitle('Erreur');
            setPopupMessage('Veuillez entrer un titre de film');
            return;
        }
        await addToHistory(searchValue);
        await search(searchValue);
    };

    const search = async (query) => {
        setFormLoading(true);
        searchMedia(query).then((res) => {
            setFormLoading(false);
            if (res.success) {
                setSearchResults(res.data);
            } else {
                setShowPopup(true)
                setPopupTitle('Erreur');
                setPopupMessage(res.errorType);
            }
        });
    }

    const closePopup = () => {
        setShowPopup(false);
        setPopupTitle('');
        setPopupMessage('');
    }

    return (
        <div className={`${styles.search} ${searchResults.length > 0 ? styles.showResults : ""}`}>
            {
                showDetails ? <MediaDetails media={showDetails} closeAction={() => setShowDetails(null)}/> : null
            }
            <img src={"/assets/search.svg"} alt={"search"}/>
            {showPopup ? <Popup title={popupTitle} text={popupMessage} close={closePopup}/> : null}
            <form onSubmit={handleSubmit}>
                <div>
                    <input ref={inputRef} autoComplete={"off"} type={"search"} id={"search"} name={"search"} required
                           placeholder={"Recherche"}
                           onChange={(e) => setSearchValue(e.target.value)}></input>
                    <button type="submit" className={"button " + (formLoading ? styles.loading : "")}>
                        <LordIcon iconName={"search-white"} animationType={"hover"}/>
                        <LordIcon iconName={"loader-white"} animationType={"loop"}/>
                    </button>
                </div>

            </form>

            <div className={`${styles.history} ${history.length > 0 ? styles.historyDeploy : ""} ${searchResults.length > 0 ? styles.hideHistory : null}`}>
                    {history.map((query) => {
                        return (
                            <div onClick={() => {
                                inputRef.current.value = query;
                                search(query)}
                            }>
                                <p>{query}</p>
                            </div>
                        )
                    })}
            </div>

            {
                searchResults.length > 0 ?
                    <div className={styles.results}>
                        {searchResults.map((movie) => {
                            return (
                                <MediaTile media={movie} onClickAction={() => setShowDetails(movie)}/>
                            )
                        })}
                    </div>
                    : null
            }
        </div>
    )
}