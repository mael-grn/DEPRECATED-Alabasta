import {motion} from "framer-motion";
import LightMedia from "@/app/models/LightMedia";
import {useRouter} from "next/navigation";

interface LightMediaComponentProps {
    media: LightMedia;
}

export default function LightMediaComponent({media}: LightMediaComponentProps) {

    const router = useRouter();

    return (
        <div>
            <motion.div
                className={"p-2 md:w-56 w-28 md:min-w-56 min-w-28 flex flex-col justify-center items-start bg-on-background gap-2 rounded-xl overflow-hidden cursor-pointer md:hover:bg-on-background-hover active:scale-85"}
                key="popup"
                initial={{ transform: "scale(0)" }}
                whileInView={{ transform: "scale(1)" }}
                onClick={() => {router.push(`/secure/media?type=${media.type}&tmdbId=${media.tmdbId}`)}}
            >
                {
                    media.posterUrl === "" ?
                        <div className={"d:w-52 w-24 md:min-w-52 min-w-24 md:h-78 h-36 md:min-h-78 min-h-36 rounded-lg bg-on-background-hover flex justify-center items-center"}>
                            <img src={"/icons/movie.svg"} alt={"movie"} className={"invert w-14"}/>
                        </div> :
                        <img alt={"poster"} src={media.posterUrl} className={"md:w-52 w-24 md:min-w-52 min-w-24 md:h-78 h-36 md:min-h-78 min-h-36 object-cover rounded-lg"} />

                }
                <p className={"font-bold text-nowrap"}>{media.title}</p>
                <p className={"text-on-foreground"}>{media.year}</p>
            </motion.div>
        </div>
    )
}