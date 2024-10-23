'use client';

export default function Home() {

    return (
        <div>
            <Image alt={"desert background"} height={1920} width={1080} src={"./assets/desert.jpg"}/>
            <form>
                <h1>Bienvenue sur Alabasta !</h1>
                <label htmlFor={"pin"}>Pour pouvoir acceder a la plateforme, merci de rentrer votre code pin :</label>
                <input type={"password"} id={"pin"} name={"pin"} required placeholder={"Code Pin"}></input>
            </form>
        </div>
    );
}
