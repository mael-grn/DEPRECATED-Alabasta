'use client';

import LightMedia from "@/app/models/lightMedia";
import { motion } from "framer-motion";
import {useRouter} from "next/navigation";

export default function LightMediaComponent({media, index=0}:{media: LightMedia, index?:number}) {

    const router = useRouter();
    return (
        <motion.div
            key={index}
            initial={{ opacity: 0, transform: "scale(0.5)" }}
            animate={{ opacity: 1, transform: "scale(1)" }}
            exit={{ opacity: 0, transform: "scale(0.5)" }}
            transition={{delay: index*0.05, duration: 0.5}}
            onClick={() => router.push("/secure/media/" + media.tmdbId)}
            className={"w-40 min-w-40 cursor-pointer flex flex-col gap-1 overflow-hidden bg-on-background border-1 rounded-lg border-on-background-hover md:hover:bg-on-background-hover active:bg-on-background-hover"}>
            <img src={media.posterUrl} alt={media.title} className={"w-full"}/>
            <div className={"p-2 flex flex-col gap-1"}>
                <p className={"text-bold text-sm line-clamp-2"}>{media.title}</p>
                <p className={"text-on-foreground-hover text-sm italic"}>{media.type} ● {media.year}</p>
            </div>
        </motion.div>
    );
}