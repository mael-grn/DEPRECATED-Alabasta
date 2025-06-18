'use client';

import MainPage, {PageAlignmentEnum} from "@/app/components/mainPage";
import {useEffect, useState} from "react";
import Section from "@/app/components/section";
import MeService from "@/app/services/meService";
import {User} from "@/app/models/user";
import Popup from "@/app/components/popup";
import ShowInfo from "@/app/components/showInfo";
import SessionService from "@/app/services/sessionService";
import {useRouter} from "next/navigation";
import {ActionTypeEnum} from "@/app/components/Button";

export default function Page() {

    const [user, setUser] = useState<User | null>(null);
    const [userLoading, setUserLoading] = useState(true);
    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState("");
    const [popupTitle, setPopupTitle] = useState("");
    const [logoutLoading, setLogoutLoading] = useState(false);

    const router = useRouter();

    useEffect(() => {
        setUserLoading(true);
        MeService.getMe().then((user) => {
            setUser(user);
        }).catch((e) => {
            setPopupTitle("Erreur");
            setPopupMessage(e);
            setShowPopup(true);
        }).finally(() => {
            setUserLoading(false);
        })
    }, []);

    function logout() {
        setLogoutLoading(true);
        SessionService.logout().then(() => {
            router.push("/");
        }).catch((e) => {
            setPopupTitle("Erreur");
            setPopupMessage(e);
            setShowPopup(true);
        }).finally(() => {
            setLogoutLoading(false);
        });
    }

    return (
        <MainPage title={"Mon compte"} pageAlignment={PageAlignmentEnum.tileStart}>
            <Section loading={userLoading} title={"Vos informations"} actions={[{text: "Modifier", iconName: "edit"}]}>
                <ShowInfo data={user?.first_name} title={"Prénom"} separator={true}/>
                <ShowInfo data={user?.last_name} title={"Nom"} separator={true}/>
                <ShowInfo data={user?.username} title={"Nom d'utilisateur"} separator={true}/>
                <ShowInfo data={user?.is_public ? "Publique" : "Privé"} title={"Confidentialité"}/>
            </Section>

            <Section title={"Déconnexion"} actions={[{text:"Déconnexion", iconName:"logout", onClick: logout, isLoading: logoutLoading, actionType: ActionTypeEnum.dangerous}]}>
                <p>Déconnectez vous de votre compte sur cet appareil et retournez à la page d`&apos;accueil.</p>
            </Section>

            <Popup show={showPopup} message={popupMessage} title={popupTitle} closePopup={() => setShowPopup(false)}/>
        </MainPage>
    );
}