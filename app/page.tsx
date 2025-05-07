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
      <main>



          <Loading showLoading={loading}/>
      </main>
  );
}