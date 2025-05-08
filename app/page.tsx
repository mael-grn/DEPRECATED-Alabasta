'use client'

import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import Loading from "@/app/components/loading";

export default function Home() {

    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function checkToken() {
            const res = await fetch("/api/auth");
            if (res.ok) router.push("/secure");
        }
        checkToken().finally(() => setLoading(false));
    }, [router]);


  return (
      <main className={"flex flex-col items-center justify-center gap-6 h-[100vh]"}>
            <img src={"/img/desert.svg"} alt={"desert"} className={"md:w-1/4 w-3/4"} />
            <h1 className={"text-center"}>Bienvenue sur Alabasta !</h1>
          <p className={"text-center"}>Pour commencer, créez vous un compte ou connectez-vous.</p>
          <div className={"flex gap-4"}>
              <button style={{background: "transparent"}} className={"border-2 border-foreground"} onClick={() => router.push("/login")}>Se connecter</button>
              <button onClick={() => router.push("/register")}>Créer un compte</button>
          </div>


          <Loading showLoading={loading}/>
      </main>
  );
}