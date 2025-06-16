'use client'
import Input from "@/app/components/Input";
import {useState} from "react";

export default function Page() {

    const [nameForm, setNameForm] = useState("");

    return (
        <main className={"flex items-center justify-center h-screen flex-col gap-6"}>

            <h2
            >
                Créez-vous un compte
            </h2>

            <form>
                <Input placeholder={"Nom"} value={nameForm} setValueAction={setNameForm}/>
            </form>

            <a>
                J'ai déjà un compte
            </a>

        </main>
    );
}