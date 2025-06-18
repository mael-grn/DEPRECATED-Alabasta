'use client'
import Input from "@/app/components/Input";
import {useState} from "react";
import {basicStringValidator,} from "@/app/utils/stringUtil";
import Popup from "@/app/components/popup";
import SessionService from "@/app/services/sessionService";
import {useRouter} from "next/navigation";
import MainPage, {PageAlignmentEnum} from "@/app/components/mainPage";
import Section from "@/app/components/section";

export default function Page() {

    const [usernameForm, setUsernameForm] = useState("");
    const [passwordForm, setPasswordForm] = useState("");

    const [loading, setLoading] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState("");
    const [popupTitle, setPopupTitle] = useState("");
    const [popupIcon, setPopupIcon] = useState("info");

    const router = useRouter();

    async function handleSubmit(event: React.FormEvent) {
        event.preventDefault();

        if (basicStringValidator(usernameForm) !== null || basicStringValidator(passwordForm) !== null) {
            setShowPopup(true);
            setPopupMessage("Veuillez remplir tous les champs correctement.");
            setPopupTitle("Erreur de saisie");
            setPopupIcon("warning");
            return;
        }

        setLoading(true);
        const res = await SessionService.login(usernameForm, passwordForm);
        setLoading(false);

        if (res.success) {
            router.push("/secure/home");
        } else {
            setShowPopup(true);
            setPopupMessage(res.error || "Une erreur est survenue lors de la connexion de votre compte. Veuillez réessayer plus tard.");
            setPopupTitle("Erreur");
            setPopupIcon("error");
        }
    }

    return (
        <MainPage title={"Connexion"} pageAlignment={PageAlignmentEnum.center}>


            <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-4 bg-background-deep p-8 rounded-xl"
            >
                <Section actions={[{iconName:"ship", text:"Créer un compte", isSecondary:true, onClick: () => router.push("/auth/register")}, {isLoading:loading, isForm:true, iconName:"key", text:"Connexion"}]}>
                    <Input placeholder={"Nom d'utilisateur"} value={usernameForm} setValueAction={setUsernameForm}
                           iconName={"user"} validatorAction={basicStringValidator}/>
                    <Input placeholder={"Mot de passe"} value={passwordForm} setValueAction={setPasswordForm}
                           iconName={"lock"} validatorAction={basicStringValidator} type={"password"}/>
                </Section>
            </form>




            <Popup show={showPopup} message={popupMessage} title={popupTitle} closePopup={() => setShowPopup(false)}
                   icon={popupIcon}/>

        </MainPage>
    );
}