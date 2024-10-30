"use client"

import Image from "next/image";
import styles from "@/app/home/search/page.module.css";
import Popup from "@/app/components/popup";
import LordIcon from "@/app/components/lordIcon";
import {login, searchMovie} from "@/app/utils/queryUtils";
import {useState} from "react";
import MovieResume from "@/app/components/movieResume";

export default function Search() {

    const [searchValue, setSearchValue] = useState('');
    const [formLoading, setFormLoading] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [popupTitle, setPopupTitle] = useState('');
    const [popupMessage, setPopupMessage] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormLoading(true);

        if (!searchValue) {
            setFormLoading(false);
            setShowPopup(true)
            setPopupTitle('Erreur');
            setPopupMessage('Veuillez entrer un titre de film');
            return;
        }

        searchMovie(searchValue).then((res) => {
            setFormLoading(false);
            if (res.success) {
                setSearchResults(res.data);
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
        <div className={`${styles.search} ${searchResults.length > 0 ? styles.showResults : ""}`}>
            <Image src={"/assets/search.svg"} alt={"search"} width={1920} height={1080}/>
            {showPopup ? <Popup title={popupTitle} text={popupMessage} close={closePopup}/> : null}
            <form onSubmit={handleSubmit}>
                <div>
                    <input autoComplete={"off"} type={"search"} id={"search"} name={"search"} required
                           placeholder={"Recherche"}
                           onChange={(e) => setSearchValue(e.target.value)}></input>
                    <button type="submit" className={"button " + (formLoading ? styles.loading : "")}>
                        <LordIcon iconName={"search-white"} animationType={"hover"}/>
                        <LordIcon iconName={"loader-white"} animationType={"loop"}/>
                    </button>
                </div>

            </form>

            {
                searchResults.length > 0 ?
                    <div className={styles.results}>
                        {searchResults.map((movie) => {
                            return (
                                <MovieResume movie={movie}/>
                            )
                        })}
                    </div>
                    : null
            }
        </div>
    )
}