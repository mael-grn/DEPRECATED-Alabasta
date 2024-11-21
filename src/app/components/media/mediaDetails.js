import {useEffect, useRef, useState} from "react";
import {localRecoverUser} from "@/app/controller/userController";
import {getMovieDetails, getSeasonDetails, getTvDetails} from "@/app/controller/mediaController";
import styles from "@/app/components/media/mediaDetails.module.css"
import LordIcon from "@/app/components/ui/lordIcon";
import Image from "next/image";
import {addToWatchList, checkIfInWatchList, removeFromWatchList} from "@/app/controller/watchListController";
import DropDown from "@/app/components/ui/dropDown";
import {useRouter} from "next/navigation";

export default function MediaDetails({media, closeAction}) {
    const router = useRouter()
    const [isDemoUser, setIsDemoUser] = useState(false);
    const [loading, setLoading] = useState(true);
    const bgRef = useRef(null);
    const mediaDetailsRef = useRef(null);
    const [mediaDetails, setMediaDetails] = useState(null);
    const watchBtnRef = useRef(null);
    const listBtnRef = useRef(null);
    const [inWatchList, setInWatchList] = useState(false);
    const [watchListLoading, setWatchListLoading] = useState(true);
    const [season, setSeason] = useState(null);
    const [seasonLoading, setSeasonLoading] = useState(false);

    const close = () => {
        bgRef.current.classList.add(styles.closing);
        mediaDetailsRef.current.classList.add(styles.closing);
        setTimeout(() => {
            closeAction();
        }, 500);
    }

    function truncateString(str, maxLength = 200) {
        if (str.length > maxLength) {
            return str.slice(0, maxLength) + "...";
        }
        return str;
    }

    useEffect(() => {
        localRecoverUser().then((user) => {
            if (user && user.id === 3) {
                setIsDemoUser(true);
            }
        });
        checkIfInWatchList(media.id, media.type).then((response) => {
            setWatchListLoading(false);
            if (response.data) {
                setInWatchList(true);
            }
        });
        switch (media.type) {
            case "movie":
                getMovieDetails(media.id).then((res) => {
                    if (res.success) {
                        setMediaDetails(res.data)
                        setLoading(false)
                    } else {

                    }
                });
                break;
            case "tv":
                getTvDetails(media.id).then((res) => {
                    if (res.success) {
                        console.log(res.data)
                        setMediaDetails(res.data)
                        setLoading(false)
                    }
                });
                changeSeasonDisplay(1)
                break;
        }

    }, []);

    const changeSeasonDisplay = (seasonNum) => {
        setSeasonLoading(true)
        getSeasonDetails(media.id, seasonNum).then((res) => {
            setSeasonLoading(false)
            if (res.success) {
                setSeason(res.data)
            }
        });
    }

    const preventScrollPropagation = (e) => {
        e.stopPropagation();
    };

    const toggleWatchList = () => {
        setWatchListLoading(true)
        if (inWatchList) {
            removeFromWatchList(media.id, media.type).then((response) => {
                setWatchListLoading(false)
                if (response.success) {
                    setInWatchList(false);
                }
            });
        } else {
            addToWatchList(media.id, media.type).then((response) => {
                setWatchListLoading(false)
                if (response.success) {
                    setInWatchList(true);
                }
            });
        }
    }

    const watch = (season = 1, episode = 1) => {
        if (isDemoUser) return;
        switch (media.type) {
            case "movie":
                router.push("/watch/" + media.id);
                break;
            case "tv":
                router.push("/watch/" + media.id + `/${season}/${episode}`);
                break;
            default:
                break;
        }
    }

    return (
        <div onWheel={preventScrollPropagation}>
            <div className={styles.mediaDetailsBg} onClick={close} ref={bgRef}/>
            <div className={`${styles.mediaDetails} ${loading ? styles.loading : null}`} ref={mediaDetailsRef}>

                <button className={styles.closeBtn} onClick={close}>
                    <p>Fermer</p>
                    <LordIcon iconName={"cross-white"} animationType={"hover"}/>
                </button>
                {
                    loading ? <LordIcon iconName={"loader-white"} animationType={"loop"}/> :
                        <div>
                            <Image src={mediaDetails.backdrop} alt={mediaDetails.title} width={1920} height={1080}
                                   className={styles.backdrop}/>
                            <div className={styles.mediaDetailsContent}>
                                <h1>{mediaDetails.title}</h1>
                                <p></p>
                                <p>{mediaDetails.vote}/10 | {mediaDetails.year} | {mediaDetails.runtime} minutes</p>
                                <div className={styles.genreTag}>
                                    {
                                        mediaDetails.genres.map((genre) => {
                                            return <p>{genre}</p>
                                        })
                                    }
                                </div>
                                <div className={styles.buttonDiv}>
                                    {
                                        isDemoUser ? null :
                                            <button
                                                className={styles.watchBtn}
                                                onClick={watch}
                                                onMouseEnter={() => {
                                                    if (watchBtnRef) watchBtnRef.current.triggerAnimation()
                                                }}>
                                                <div>
                                                    <p>Regarder</p>
                                                    <LordIcon ref={watchBtnRef} iconName={"play-white"}
                                                              animationType={"hover"}/>
                                                </div>

                                            </button>
                                    }
                                    <button
                                        onClick={toggleWatchList}
                                        className={inWatchList && !watchListLoading ? styles.inWatchList : ""}
                                        onMouseEnter={() => {
                                            if (listBtnRef) listBtnRef.current.triggerAnimation()
                                        }}
                                    >
                                        {watchListLoading ?
                                            <LordIcon ref={listBtnRef} iconName={"loader-black"} animationType={"loop"}/> : null}
                                        {!watchListLoading ?
                                            <LordIcon ref={listBtnRef} iconName={inWatchList ? "bookmark-white" : "bookmark-black"}
                                                      animationType={"hover"}/> : null}
                                        {inWatchList && !watchListLoading ? "Dans la liste de lecture" : null}
                                    </button>
                                </div>
                                <p style={mediaDetails.type === "movie" ? {paddingBottom: 170} : null}>{mediaDetails.overview}</p>
                                {
                                    mediaDetails.type === "tv" ?
                                        <div>
                                            <DropDown optionList={mediaDetails.children.map((child) => child.title)} onSelect={(i) => changeSeasonDisplay(i+1)}/>
                                            {
                                                seasonLoading ?
                                                    <div className={styles.seasonDiv}>
                                                        <LordIcon iconName={"loader-white"} animationType={"loop"}/>
                                                    </div> :
                                                    season ? <div className={styles.seasonDiv} style={mediaDetails.type === "tv" ? {paddingBottom: 170} : null}>
                                                        <div className={styles.epList}>
                                                            {
                                                                season.children.map((episode, key) => {
                                                                    return <div className={styles.episode} onClick={() => watch(season.number, episode.number)}>
                                                                        <span>{episode.number}</span>
                                                                        <Image src={episode.poster} alt={episode.title} width={500} height={280}/>
                                                                        <div>
                                                                            <h2>{episode.title}</h2>
                                                                            <p>{truncateString(episode.overview)}</p>
                                                                        </div>

                                                                    </div>
                                                                })
                                                            }
                                                        </div>
                                                    </div> : null
                                            }
                                        </div>
                                        : null
                                }
                            </div>
                        </div>

                }
            </div>
        </div>

    )
}