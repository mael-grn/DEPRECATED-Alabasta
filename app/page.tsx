'use client'
import {useRouter} from "next/navigation";
import Button from "@/app/components/Button";
import {useEffect, useState} from "react";
import MeService from "@/app/services/meService";
import LoadingPopup from "@/app/components/loadingPopup";

export default function Home() {

    const router = useRouter();

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        MeService.getMe().then((res) => {
            if(res.success && res.data?.is_approved) {
                router.push("/secure/home");
            }
        }).finally(() => {
            setLoading(false);
        })
    }, [router]);

  return (
      <main className={"flex items-center justify-center h-screen flex-col gap-12"}>

          <h1
            className={"text-7xl"}
          >
              Bienvenue sur Alabasta
          </h1>

          <div className="flex items-center justify-center gap-6">
              <Button
                  iconName={"ship"}
                  text={"Créer un compte"}
                  onClick={() => router.push("/auth/register")}
                  isSecondary={true}
              />

              <Button
                  iconName={"key"}
                  text={"Connexion"}
                  onClick={() => router.push("/auth/login")}
                  animationDelay={0.2}
              />
          </div>

          <LoadingPopup show={loading}/>

      </main>
  );
}