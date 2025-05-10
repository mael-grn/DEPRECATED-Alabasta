import LightMedia from "@/app/models/LightMedia";
import LightMediaComponent from "@/app/components/LightMedia";
import { motion } from "framer-motion";

interface LightMediaCarrouselProps {
    isLoading: boolean;
    mediaList: LightMedia[];
    title: string;
}

export default function LightMediaCarrousel({isLoading, mediaList, title}: LightMediaCarrouselProps) {

    return (
        <div className={"p-3 flex flex-col gap-3"}>
            <motion.h1
                key={`title=${title}`}
                initial={{ transform: "translateX(-200px)", opacity: 0 }}
                whileInView={{ transform: "translateX(0px)", opacity: 1 }}
                exit={{ transform: "translateX(-200px)", opacity: 0 }}
            >
                {title}
            </motion.h1>
            {
                isLoading ?
                    <div className={"md:h-78 h-36 flex justify-center items-center w-full"}>
                        <img src={"/icons/loader-light.gif"} className={"w-12"} alt="loader" />
                    </div>
                    :
                    <div className={"h-fit flex gap-3 w-full max-w-full min-w-full overflow-auto rounded-lg"}>
                        {
                            mediaList.map((media: LightMedia) => <div key={media.tmdbId}><LightMediaComponent media={media}/></div>)
                        }
                    </div>
            }
        </div>
    )
}