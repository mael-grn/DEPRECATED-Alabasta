"use client";

import {useRouter} from "next/navigation";

export default function BackButton() {
    const router = useRouter();
    return (
        <button
            className=" absolute top-4 left-4 flex gap-2 items-center justify-center pl-4 pr-4 pt-1 pb-1 bg-on-background rounded-lg md:hover:bg-on-background-hover active:bg-on-background-hover cursor-pointer"
            onClick={() => router.back()}
        >
            <img src="/icons/arrow-back.svg" alt="Back" className="w-6 invert" />
            <span>Retour</span>
        </button>
    );
}