import {useEffect, useLayoutEffect, useRef, useState} from "react";
import {localRecoverUser} from "@/app/controller/userController";
import {getMovieDetails, getSeasonDetails, getTvDetails} from "@/app/controller/mediaController";
import styles from "@/app/components/media/mediaDetails.module.css"
import LordIcon from "@/app/components/ui/lordIcon";
import Image from "next/image";
import {addToWatchList, checkIfInWatchList, removeFromWatchList} from "@/app/controller/watchListController";
import DropDown from "@/app/components/ui/dropDown";
import {useRouter} from "next/navigation";
import {load} from "cheerio";

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
    const scrollableRef = useRef(null);

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
        const element = scrollableRef.current;
        const handleWheel = (e) => {
            if (!element) return;
            const { scrollTop, scrollHeight, clientHeight } = element;
            e.stopPropagation();
            const atTop = scrollTop === 0;
            const atBottom = scrollTop + clientHeight + 1 >= scrollHeight;
            if ((atTop && e.deltaY < 0) || (atBottom && e.deltaY > 0)) {
                e.preventDefault();
            }
        };
        if (element) {
            element.addEventListener('wheel', handleWheel, { passive: false });
        }
        return () => {
            if (element) {
                element.removeEventListener('wheel', handleWheel);
            }
        };
    }, [loading]);

    useLayoutEffect(() => {
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
        e.preventDefault();
        console.log("prevent");
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

    const watch = (seasonNum = 1, episodeNum = 1) => {
        if (isDemoUser) return;
        switch (media.type) {
            case "movie":
                router.push("/watch/" + media.id);
                break;
            case "tv":
                router.push("/watch/" + media.id + `/${seasonNum}/${episodeNum}`);
                break;
            default:
                break;
        }
    }

    return (
        <div>
            <div className={styles.mediaDetailsBg} onClick={close} ref={bgRef}/>
            <div className={`${styles.mediaDetails} ${loading ? styles.loading : null}`} ref={mediaDetailsRef}>

                <button className={styles.closeBtn} onClick={close}>
                    <p>Fermer</p>
                    <LordIcon iconName={"cross-white"} animationType={"hover"}/>
                </button>
                {
                    loading ? <LordIcon iconName={"loader-white"} animationType={"loop"}/> :
                        <div ref={scrollableRef}>
                            <img src={mediaDetails.backdrop} alt={mediaDetails.title}
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
                                                onClick={() => watch(mediaDetails.seasonProgress, mediaDetails.episodeProgress) }
                                                onMouseEnter={() => {
                                                    if (watchBtnRef) watchBtnRef.current.triggerAnimation()
                                                }}>
                                                <div>
                                                    <p>
                                                        {
                                                            mediaDetails.progress > 0 ?
                                                                "Reprendre" :
                                                                "Regarder"
                                                        }
                                                    </p>
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
                                <p>
                                    {
                                        mediaDetails.progress > 0 ?
                                            mediaDetails.type === "tv" ?
                                                "Saison " + mediaDetails.seasonProgress + " Episode " + mediaDetails.episodeProgress :
                                                Math.round((mediaDetails.progress * mediaDetails.runtime / 100))  + "min vues sur " + mediaDetails.runtime + "min" : null
                                    }
                                </p>
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
                                                                        <img src={episode.poster} alt={episode.title}/>
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