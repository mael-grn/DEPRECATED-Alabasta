'use client'

import {useEffect, useState} from "react";
import TmdbService from "@/app/services/tmdbService";
import LightMedia from "@/app/models/LightMedia";
import Popup from "@/app/components/popup";
import LightMediaComponent from "@/app/components/LightMedia";

export default function Page() {

    const [loading, setLoading] = useState(false);
    const [query, setQuery] = useState<string>("");
    const [searchResults, setSearchResults] = useState<LightMedia[]>([]);
    const [hasSearched, setHasSearched] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [popupTitle, setPopupTitle] = useState<string>('');
    const [popupContent, setPopupContent] = useState<string>('');

    const canSearch = () => query !== "" && query.length >= 3


    const search = async () => {
        setLoading(true);
        if (!canSearch()) {
            setShowPopup(true);
            setPopupTitle('Attention');
            setPopupContent('Merci de saisir au moins trois caractères pour lancer une recherche.')
        }
        const res = await TmdbService.searchMovie(query)

        if (!res.success) {
            setShowPopup(true);
            setPopupTitle('Erreur');
            setPopupContent(res.error ?? "Une erreur s'est produite")
        }

        setSearchResults(res.data!)
        setHasSearched(true);
        setLoading(false);
    }

    useEffect(() => {
        if (canSearch()) {
            search()
        }
    }, [canSearch, search]);



    return (
        <div className={"flex flex-col gap-3 items-center justify-center flex-1"}>
            <h1>Rechercher</h1>
            <div className={"flex gap-3"}>
                <input placeholder={"Rechercher"} type={"search"} value={query} onChange={(e) => setQuery(e.target.value)} />
                <button disabled={loading} onClick={() => {search()}}>
                    <img src={loading ? "/icons/loader-dark.gif" : "/icons/search.svg"} alt="loading" className={"invert"}/>
                    Rechercher
                </button>
            </div>

            {
                !loading && searchResults.length > 0 ?
                <div className="flex gap-3 flex-wrap">
                    {
                        searchResults.map((item) => {
                            return <div key={item.tmdbId}><LightMediaComponent media={item}/></div>
                        })
                    }
                </div> :
                    searchResults.length === 0 && query && hasSearched ?
                        <div className="flex gap-3 flex-col items-center justify-center mt-20">
                            <img src={"/icons/info.svg"} alt={"info"} className={"invert w-12"}/>
                            <p>Aucun résultat</p>
                        </div> :
                        <div className="flex gap-3 flex-col items-center justify-center mt-20">
                            <img src={"/icons/light.svg"} alt={"info"} className={"invert w-12"}/>
                            <p>Recherchez ce qui vous passe par la tête !</p>
                        </div>
            }

            <Popup showPopup={showPopup} onClose={() => {setShowPopup(false)}} texte={popupContent} titre={popupTitle} />
        </div>
    );
}