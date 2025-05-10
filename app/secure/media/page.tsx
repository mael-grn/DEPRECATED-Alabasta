'use client'

import {useRouter} from "next/navigation";
import {useEffect, useState} from "react";
import Media from "@/app/models/media";
import TmdbService from "@/app/services/tmdbService";
import Loading from "@/app/components/loading";

export default function Page() {

    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [media, setMedia] = useState<Media | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const action = async () => {

            const params = new URLSearchParams(window.location.search);
            const tmdbId = params.get('tmdbId');
            const type = params.get('type');

            if (!tmdbId || !type) {
                setError("Les paramètres de l'url sont invalides.");
                return;
            }

            if (type !== "movie") {
                setError("Le type de media que vous recherchez n'est pas encore supporté. Réessayez plus tard.");
                return;
            }

            const id = tmdbId?.toString()
            if (!id) {
                setError("Impossible de récuperer l'identifiant du media");
                return;
            }

            const res = await TmdbService.getMovieDetails(id);
            if (!res.success) {
                setError(res.error!);
                return;
            }

            setMedia(res.data!)
        }

        action().finally(() => setLoading(false));
    }, []);
    return (
        <div>

            {
                !loading &&  (error || !media) ?
                    <div className={"flex flex-col w-full h-full justify-center items-center gap-2"}>
                        <img src={"/icons/error.svg"} alt={"error"} className={"w-24"}/>
                        <p>{error ?? "Une erreur s'est produite."}</p>
                    </div> :
                    <div className={"flex flex-col w-full gap-2"}>

                        <div className={"relative w-full overflow-hidden rounded-t-2xl object-cover h-[50vh]"}>

                            <img src={media?.backdropUrl} alt={"backdrop"} className={"w-full h-full object-cover"} />
                            <span className={"absolute bottom-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-background"}/>
                            <span
                                onClick={() => router.back()}
                                className={"p-4 cursor-pointer flex justify-center items-center rounded-xl md:hover:bg-on-background-hover bg-on-background active:scale-90 absolute top-2 left-2"}>
                                <img src={"/icons/arrow-back.svg"} alt={"arrow-back"} className={"invert w-8"}/>
                            </span>
                            <h1
                                className={"absolute bottom-2 left-2"}
                            >
                                {media?.title}
                            </h1>
                        </div>

                        <div className={"flex gap-3 ml-6"}>
                            <p>{media?.year}</p>
                            <p>•</p>
                            <p>{media?.runtime} min</p>
                            <p>•</p>
                            <p>{media?.vo}</p>
                        </div>

                        <div className={"flex flex-wrap gap-3 mt-3 ml-6"}>
                            {
                                media?.genres.map(genre => {
                                    return <div key={genre} className={"pt-2 pb-2 pl-4 pr-4 rounded-3xl bg-on-background"}>{genre}</div>;
                                })
                            }
                        </div>

                        <button className={"w-fit mt-6 ml-6"} onClick={() => router.push("/secure/stream?tmdbId=" + media?.tmdbId)}>
                            <img src={"/icons/play.svg"} alt={"play"} className={"invert"}/>
                            Regarder
                        </button>

                        <div className={"flex gap-2 flex-wrap mt-6"}>

                            <div className={"p-4 rounded-xl bg-on-background flex flex-col gap-3 flex-1"}>

                                <div className={"flex gap-3"}>
                                    <img src={"/icons/star.svg"} alt={"doc"} className={"invert w-6"}/>
                                    <h2>Note</h2>
                                </div>

                                <div className={"flex gap-3 h-full flex-col justify-center"}>
                                    <div className={"flex gap-1 w-full justify-center"}>
                                        <p className={"text-5xl bold"}>{media?.vote}</p>
                                        <p>/10</p>
                                    </div>

                                    <p className={"text-on-foreground-hover w-full text-center"}>{media?.voteCount} avis</p>
                                </div>
                            </div>


                            <div className={"p-4 rounded-xl bg-on-background flex-10 gap-3 flex flex-col min-w-[300px]"}>
                                <div className={"flex gap-3"}>
                                    <img src={"/icons/document.svg"} alt={"doc"} className={"invert w-6"}/>
                                    <h2>Résumé</h2>
                                </div>

                                <p>{media?.overview}</p>
                            </div>


                        </div>
                    </div>

            }
            <Loading showLoading={loading}/>
        </div>
    )
}