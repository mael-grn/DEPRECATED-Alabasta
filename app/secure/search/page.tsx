'use client';

import MainPage, {PageAlignmentEnum} from "@/app/components/mainPage";
import {useState} from "react";
import Section from "@/app/components/section";
import Input from "@/app/components/Input";
import LightMediaComponent from "@/app/components/lightMedia";
import Popup from "@/app/components/popup";
import MediaService from "@/app/services/mediaService";
import LightMedia from "@/app/models/lightMedia";
import {AnimatePresence} from "framer-motion";

export default function Page() {

    const [searchResults, setSearchResults] = useState<LightMedia[]>([]);
    const [searchQuery, setSearchQuery] = useState("");

    const [loading, setLoading] = useState(false);

    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState("");
    const [popupTitle, setPopupTitle] = useState("");

    const searchMedia = async () => {
        if (!searchQuery) {
            setShowPopup(true);
            setPopupMessage("Il semble que vous n'avez rien saisi dans le champs de recherche. Merci de saisir un mot clé pour effectuer une recherche.");
            setPopupTitle("Vous avez oublié quelque chose ?");
            return;
        }
        setLoading(true);
        try {
            const res = await MediaService.searchMedia(searchQuery);
            console.log(res);
            setSearchResults(res);
        } catch (error) {
            setShowPopup(true);
            setPopupMessage(error as string);
            setPopupTitle("Une erreur s'est produite lors de la recherche");
        } finally {
            setLoading(false);
        }
    }

    return (
        <MainPage title={"Rechercher"} pageAlignment={PageAlignmentEnum.center}>
            <Section actions={[{text:"Rechercher", iconName:"search", isLoading:loading, onClick: searchMedia}]}>
                <Input placeholder={"Rechercher"} value={searchQuery} setValueAction={setSearchQuery} iconName={"search"}/>
            </Section>

            <div className={'flex gap-4 flex-wrap w-full justify-center'}>
                <AnimatePresence>
                    {
                        searchResults.map((media, index) => {
                            return <LightMediaComponent index={index} media={media} key={index}/>
                        })
                    }
                </AnimatePresence>
            </div>
            <Popup show={showPopup} message={popupMessage} title={popupTitle} closePopup={() => setShowPopup(false)}/>
        </MainPage>
    );
}