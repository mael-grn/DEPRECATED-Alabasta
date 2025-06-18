'use client'
import Input from "@/app/components/Input";
import {useState} from "react";
import {basicStringValidator, passwordStringValidator} from "@/app/utils/stringUtil";
import DropDown from "@/app/components/DropDown";
import Popup from "@/app/components/popup";
import {UserService} from "@/app/services/userService";
import {InsertableUser} from "@/app/models/user";
import Section from "@/app/components/section";
import MainPage, {PageAlignmentEnum} from "@/app/components/mainPage";
import {useRouter} from "next/navigation";

export default function Page() {

    const [firstNameForm, setFirstNameForm] = useState("");
    const [lastNameForm, setLastNameForm] = useState("");
    const [usernameForm, setUsernameForm] = useState("");
    const [passwordForm, setPasswordForm] = useState("");
    const [passwordValidationForm, setPasswordValidationForm] = useState("");
    const [accountVisibility, setAccountVisibility] = useState("publique");

    const [loading, setLoading] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState("");
    const [popupTitle, setPopupTitle] = useState("");
    const [popupIcon, setPopupIcon] = useState("info");

    const router = useRouter();

    function passorwValidationVerificator(secondPassword: string) {
        if (passwordForm !== secondPassword) {
            return "Les mots de passe ne correspondent pas.";
        }
        return null;
    }

    async function handleSubmit(event: React.FormEvent) {
        event.preventDefault();

        if (basicStringValidator(firstNameForm) !== null || basicStringValidator(lastNameForm) !== null || basicStringValidator(usernameForm) !== null || passwordStringValidator(passwordForm) !== null || passwordForm !== passwordValidationForm) {
            setShowPopup(true);
            setPopupMessage("Veuillez remplir tous les champs correctement.");
            setPopupTitle("Erreur de saisie");
            setPopupIcon("warning");
            return;
        }

        const newUser: InsertableUser = {
            username: usernameForm,
            first_name: firstNameForm,
            last_name: lastNameForm,
            is_public: accountVisibility === "publique",
            password: passwordForm,
        }

        setLoading(true);
        const res = await UserService.createUser(newUser)
        setLoading(false);

        if (res.success) {
            setShowPopup(true);
            setPopupMessage("Votre demande de création de compte a été créée avec succès. Vous devez maintenant attendre l'activation de votre compte par un administrateur.");
            setPopupTitle("Succès");
            setFirstNameForm("");
            setLastNameForm("");
            setUsernameForm("");
            setPasswordForm("");
            setPasswordValidationForm("");
            setPopupIcon("check")
            setAccountVisibility("publique");
        } else {
            setShowPopup(true);
            setPopupMessage(res.error || "Une erreur est survenue lors de la création de votre compte. Veuillez réessayer plus tard.");
            setPopupTitle("Erreur");
            setPopupIcon("error");
        }
    }

    return (


        <MainPage title={"Créer un compte"} pageAlignment={PageAlignmentEnum.center}>
            <Section actions={[{iconName:"login", text:"Connexion", isSecondary:true, onClick: () => router.push("/auth/login")},{isLoading:loading, isForm:true, iconName:"ship", text:"Créer mon compte"}]}>
                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-3"
                >
                    <Input placeholder={"Prénom"} value={firstNameForm} setValueAction={setFirstNameForm} iconName={"user"}
                           validatorAction={basicStringValidator}/>
                    <Input placeholder={"Nom"} value={lastNameForm} setValueAction={setLastNameForm} iconName={"user"}
                           validatorAction={basicStringValidator}/>
                    <Input placeholder={"Nom d'utilisateur"} value={usernameForm} setValueAction={setUsernameForm}
                           iconName={"user"} validatorAction={basicStringValidator}/>
                    <Input placeholder={"Mot de passe"} value={passwordForm} setValueAction={setPasswordForm}
                           iconName={"lock"} validatorAction={passwordStringValidator} type={"password"}/>
                    <Input placeholder={"Validation du mot de passe"} value={passwordValidationForm}
                           setValueAction={setPasswordValidationForm} iconName={"lock"}
                           validatorAction={passorwValidationVerificator} type={"password"}/>
                    <div className={"flex gap-3 items-center justify-center"}>
                        <p>Visibilité de votre compte : </p>
                        <DropDown items={["publique", "privé"]} selectedItem={accountVisibility}
                                  setSelectedItemAction={setAccountVisibility}/>
                    </div>
                </form>
            </Section>

            <Popup show={showPopup} message={popupMessage} title={popupTitle} closePopup={() => setShowPopup(false)}
                   icon={popupIcon}/>

        </MainPage>
    );
}