"use client";

import {AnimatePresence, motion} from "framer-motion";
import {usePathname, useRouter} from "next/navigation";
import {useEffect, useState} from "react";

export default function Navbar() {

    const pathname = usePathname();
    const router = useRouter();

    const [pageIndex, setPageIndex] = useState<number>(0);
    const [navbarAreaHovered, setNavbarAreaHovered] = useState<boolean>(false);

    useEffect(() => {
        setPageIndex(routes.findIndex(route => pathname.startsWith(route.route)))
    }, [pathname]);

    interface NavRoute {
        name: string;
        icon: string;
        route: string;
    }

    const routes: NavRoute[] = [
        {
            name: "Accueil",
            icon: "home",
            route: "/secure/home"
        },
        {
            name: "Rechercher",
            icon: "search",
            route: "/secure/search"
        },
        {
            name: "Enregistrements",
            icon: "bookmark",
            route: "/secure/saved"
        },
        {
            name: "Abonnements",
            icon: "users",
            route: "/secure/subscriptions"
        },
        {
            name: "Profil",
            icon: "user",
            route: "/secure/settings"
        }
    ];

    function changePage(index: number) {
        setPageIndex(index);
        router.push(routes[index].route);

    }


    return (
        <div onMouseEnter={() => setNavbarAreaHovered(true)} onMouseLeave={() => setNavbarAreaHovered(false)} className="fixed bottom-0 left-0 w-full z-40 pb-4 flex justify-center">
            <span className="absolute bottom-0 left-0 w-full h-36 bg-gradient-to-t from-background to-transparent"/>
            <AnimatePresence>
                {
                    (pageIndex >= 0 || navbarAreaHovered) &&
                    <motion.ul
                        initial={{transform: "translateY(100%)", opacity: 0}}
                        animate={{transform: "translateY(0%)", opacity: 1}}
                        exit={{transform: "translateY(100%)", opacity: 0}}
                        className={"relative p-4 bg-on-background rounded-full flex gap-7 items-center justify-center shadow-lg w-fit"}
                        onMouseLeave={() => setPageIndex(routes.findIndex(route => pathname.startsWith(route.route)))}
                    >
                        {
                            routes.map((route, index) => (
                                <li
                                    className={'cursor-pointer'}
                                    onMouseUp={() => changePage(index)}
                                    key={index-1}
                                    onMouseEnter={() => setPageIndex(index)}
                                >
                                    <img src={`/icons/${pathname.startsWith(route.route) ? `${route.icon}-solid` : route.icon}.svg`} alt={route.name} className={`w-7 h-7 invert`} />
                                </li>
                            ))
                        }
                        <AnimatePresence>
                            {
                                pageIndex >= 0 &&
                                <motion.span
                                    initial={{transform: "scale(0)"}}
                                    animate={{transform: "scale(1)"}}
                                    exit={{transform: "scale(0)"}}
                                    style={{left: (1.5+pageIndex*14)*0.250 + "rem"}}
                                    onMouseUp={() => changePage(pageIndex)}
                                    className={`h-12 w-12 rounded-full bg-transparent backdrop-invert absolute top-1.5 cursor-pointer`}
                                />
                            }
                        </AnimatePresence>
                    </motion.ul>
                }
            </AnimatePresence>

        </div>
);
}