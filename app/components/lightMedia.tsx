'use client';

import LightMedia from "@/app/models/lightMedia";

export default function LightMediaComponent({media}:{media: LightMedia}) {

    return (
        <div className={"w-40 min-w-40 cursor-pointer flex flex-col gap-1 overflow-hidden bg-on-background border-1 rounded-lg border-on-background-hover md:hover:bg-on-background-hover active:bg-on-background-hover"}>
            <img src={media.posterUrl} alt={media.title} className={"w-full"}/>
            <div className={"p-2 flex flex-col gap-1"}>
                <p className={"text-bold text-sm line-clamp-2"}>{media.title}</p>
                <p className={"text-on-foreground-hover text-sm italic"}>{media.type} ● {media.year}</p>
            </div>
        </div>
    );
}