'use client'

import {FormEvent, useEffect, useState} from "react";
import Popup from "@/app/components/popup";
import {useRouter} from "next/navigation";
import Loading from "@/app/components/loading";
import AuthService from "@/app/services/authService";

export default function Page() {

    const router = useRouter();

    const [loading, setLoading] = useState(false);

    const [showPopup, setShowPopup] = useState(false);
    const [popupTitle, setPopupTitle] = useState("");
    const [popupContent, setPopupContent] = useState("");

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");

    const [loadingToken, setLoadingToken] = useState(true);

    useEffect(() => {
        async function checkToken() {
            const res = await fetch("/api/auth");
            if (res.ok) router.push("/secure");
        }
        checkToken().finally(() => setLoadingToken(false));
    }, [router]);

    const onSubmit = async (e:FormEvent) => {
        e.preventDefault();

        if (firstName === "" || lastName === "" || username === "" || password === "") {
            setPopupTitle("Erreur dans le formulaire");
            setPopupContent("Certains champs sont vides");
            setShowPopup(true);
            return;
        }

        if (password !== passwordConfirm) {
            setPopupTitle("Erreur dans le formulaire");
            setPopupContent("Le mot de passe et la confirmation de correspondent pas.")
            setShowPopup(true);
            return;
        }

        if (password.length < 4) {
            setPopupTitle("Erreur dans le formulaire");
            setPopupContent("Le mot de passe doit faire au moins 4 caractères")
            setShowPopup(true);
            return;
        }

        if (username.length < 4) {
            setPopupTitle("Erreur dans le formulaire");
            setPopupContent("Le nom d'utilisateur doit faire au moins 4 caractères")
            setShowPopup(true);
            return;
        }

        const regex = /^[\p{L}0-9-]+$/u;
        if (!regex.test(firstName) || !regex.test(lastName) || !regex.test(password)) {
            setPopupTitle("Erreur dans le formulaire");
            setPopupContent("Le nom, prénom et nom d'utilisateur contiennent des caractères speciaux.")
            setShowPopup(true);
            return;
        }

        setLoading(true);

        const res = await AuthService.register(username, firstName, lastName, password);

        setLoading(false)
        if (!res.success) {
            setPopupTitle("Erreur");
            setPopupContent(res.error!)
            setShowPopup(true);
        } else {
            setPopupTitle("Compte créé");
            setPopupContent("Merci d'avoir créé un compte sur Alabasta. Avant de pouvoir accéder à l'application, un administrateur doit valider votre demande. Merci de réessayer de vous connecter plus tard.")
            setShowPopup(true);
        }
    }

    return (
        <main className="bg-background w-full min-h-[100vh] flex items-center justify-center gap-6 flex-col">
            <img alt={"register"} src={"/img/informations.svg"} className={"md:w-1/8 w-1/2"}/>
            <h1 className={"text-center"}>Créez un compte sur Alabasta</h1>
            <p className={"text-center mb-12"}>Remplissez les informations ci-dessous afin de vous créer un compte.</p>
            <form className={"flex flex-col items-center justify-center gap-2"} onSubmit={onSubmit}>
                <input placeholder={"Nom"} type={"text"} value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                <input placeholder={"Prenom"} type={"text"} value={lastName} onChange={(e) => setLastName(e.target.value)} />
                <input placeholder={"Nom d'utilisateur"} type={"text"} value={username} onChange={(e) => setUsername(e.target.value)} />
                <input placeholder={"Mot de passe"} type={"password"} value={password} onChange={(e) => setPassword(e.target.value)} />
                <input placeholder={"Répétez le mot de passe"} type={"password"} value={passwordConfirm} onChange={(e) => setPasswordConfirm(e.target.value)} />

                <button disabled={loading} type={"submit"} className={`mt-6`}>
                    {
                        loading ?
                            <img alt={"redirect"} src={"/icons/loader-light.gif"} className={"-translate-x-[5px]"}/>
                            :
                            <>
                                <img alt={"redirect"} src={"/icons/ship.svg"} className="invert"/>
                                Créer un compte
                            </>
                    }
                </button>
                <a className={"flex gap-2 mt-6"} onClick={() => router.push("/login")}>
                    J&apos;ai déjà un compte
                    <img alt={"redirect"} src={"/icons/redirect.svg"} className="invert h-4 w-4"/>
                </a>
            </form>

            <Loading showLoading={loadingToken}/>
            <Popup showPopup={showPopup} titre={popupTitle} texte={popupContent} onClose={() => setShowPopup(false)} />
        </main>
    );
}