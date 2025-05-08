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

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

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

        if (username === "" || password === "") {
            setPopupTitle("Erreur dans le formulaire");
            setPopupContent("Certains champs sont vides");
            setShowPopup(true);
            return;
        }

        setLoading(true);

        const res = await AuthService.login(username, password);
        setLoading(false);
        if (!res.success) {
            setPopupTitle("Erreur");
            setPopupContent(res.error!)
            setShowPopup(true);
        } else {
            router.push("/secure");
        }
    }

    return (
        <main className="bg-background w-full min-h-[100vh] flex items-center justify-center gap-6 flex-col">
            <img alt={"connexion"} src={"/img/login.svg"} className={"md:w-1/8 w-1/2"}/>

            <h1 className={"text-center"}>Connexion</h1>
            <p className={"text-center mb-12"}>Merci d&apos;indiquer votre nom d&apos;utilisateur ainsi que votre mot de passe pour pouvoir vous connecter.</p>
            <form className={"flex flex-col items-center justify-center gap-2"} onSubmit={onSubmit}>
                <input placeholder={"Nom d'utilisateur"} type={"text"} value={username} onChange={(e) => setUsername(e.target.value)} />
                <input placeholder={"Mot de passe"} type={"password"} value={password} onChange={(e) => setPassword(e.target.value)} />

                <button disabled={loading} type={"submit"} className={`mt-6`}>
                    {
                        loading ?
                            <img alt={"loading"} src={"/icons/loader-light.gif"} className={"-translate-x-[5px]"}/>
                            :
                            <>
                                <img alt={"ship"} src={"/icons/key.svg"} className="invert"/>
                                Connexion
                            </>
                    }
                </button>
                <a className={"flex gap-2 mt-6"} onClick={() => router.push("/register")}>
                    Je n&apos;ai pas encore de compte
                    <img alt={"redirect"} src={"/icons/redirect.svg"} className="invert h-4 w-4"/>
                </a>
            </form>

            <Loading showLoading={loadingToken}/>
            <Popup showPopup={showPopup} titre={popupTitle} texte={popupContent} onClose={() => setShowPopup(false)} />
        </main>
    );
}