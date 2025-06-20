import {useRef} from "react";
import LightMedia from "@/app/models/lightMedia";
import LightMediaComponent from "@/app/components/lightMedia";

export default function LightMediaCarrousel({medias, title, loading = false}: {
    medias: LightMedia[],
    title: string,
    loading?: boolean
}) {
    const scrollRef = useRef<HTMLDivElement>(null);

    const scroll = (offset: number) => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({left: offset, behavior: "smooth"});
        }
    };

    return (
        <div className={"flex flex-col gap-3 w-full"}>
            <div className={"flex gap-2 w-full justify-between h-full items-center"}>
                <h2>{title}</h2>
                <div className={"flex gap-1 h-full items-center"}>
                    <button
                        className={"w-8 h-8 cursor-pointer flex justify-center items-center rounded-full bg-transparent md:hover:bg-on-background-hover active:bg-on-background-hover"}
                        onClick={() => scroll(-500)}
                    >
                        <img src={"/icons/chevron-left.svg"} alt={'left'} className={"w-4 invert"}/>
                    </button>
                    <button
                        className={"w-8 h-8 cursor-pointer flex justify-center items-center rounded-full bg-transparent md:hover:bg-on-background-hover active:bg-on-background-hover"}
                        onClick={() => scroll(500)}
                    >
                        <img src={"/icons/chevron-right.svg"} alt={'right'} className={"w-4 invert"}/>
                    </button>
                </div>
            </div>
            {
                loading && <div
                    className={"flex justify-center items-center bg-transparent backdrop-blur w-full h-[380px]"}>
                    <img src={"/icons/loader-light.gif"} alt={"loading"} className={"w-10"}/>
                </div>
            }
            <div ref={scrollRef} className={"flex overflow-x-auto gap-3 relative"}>
                {
                    medias.map((media, index) => <LightMediaComponent key={index} media={media} index={index}/>)
                }

            </div>
        </div>
    );
}