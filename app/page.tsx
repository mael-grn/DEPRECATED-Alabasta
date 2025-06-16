'use client'
import {useRouter} from "next/navigation";
import Button from "@/app/components/Button";

export default function Home() {

    const router = useRouter();

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
                  onClick={() => router.push("/auth/register")}
                  animationDelay={0.2}
              />
          </div>

      </main>
  );
}