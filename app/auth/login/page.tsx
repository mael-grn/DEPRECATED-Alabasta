'use client'
import Input from "@/app/components/Input";
import {useState} from "react";
import {
    basicStringValidator,
} from "@/app/utils/stringUtil";
import Button from "@/app/components/Button";
import Popup from "@/app/components/popup";
import BackButton from "@/app/components/backButton";
import SessionService from "@/app/services/sessionService";
import {useRouter} from "next/navigation";

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
        <main className={"flex items-center justify-center h-screen flex-col gap-6"}>

            <BackButton/>

            <h2>
                Connexion
            </h2>

            <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-4 bg-background-deep p-8 rounded-xl"
            >

                <Input placeholder={"Nom d'utilisateur"} value={usernameForm} setValueAction={setUsernameForm}
                       iconName={"user"} validatorAction={basicStringValidator}/>
                <Input placeholder={"Mot de passe"} value={passwordForm} setValueAction={setPasswordForm}
                       iconName={"lock"} validatorAction={basicStringValidator} type={"password"}/>
                <Button isLoading={loading} isForm={true} iconName={"key"} text={"Connexion"}></Button>
            </form>

            <Popup show={showPopup} message={popupMessage} title={popupTitle} closePopup={() => setShowPopup(false)}
                   icon={popupIcon}/>

        </main>
    );
}