"use client"

import {motion} from "framer-motion";
import {usePathname, useRouter} from "next/navigation";

export default function Navbar() {

    const router = useRouter()
    const pathname = usePathname()

    if (!pathname.startsWith("/secure")) {return null;}

    const isActualPage = (path: string) => pathname.startsWith(path)

    const routeList = [
        {route: "/secure/home", icon: "home"},
        {route: "/secure/search", icon: "search"}
    ]
    return (
        <div className={"fixed md:top-0 left-0 md:h-[100vh] md:p-4 z-10 md:bottom-auto md:w-fit bottom-0 w-full h-fit"}>
            <motion.div
                className={" p-3 md:rounded-2xl rounded-t-2xl z-10 md:h-full bg-on-background flex md:flex-col items-center justify-around md:justify-start gap-3 w-full h-fit"}
                key="navbar"
                initial={{ opacity: 0}}
                animate={{ opacity: 1 }}
            >

                {
                    routeList.map((route) => {
                        return <div key={route.route} onClick={() => router.push(route.route)} className={`rounded-lg p-3 flex justify-center items-center cursor-pointer md:hover:bg-on-background-hover active:scale-75 ${isActualPage(route.route) ? "bg-on-background-hover" : "bg-transparent"}`}>
                            <img src={isActualPage(route.route) ? `/icons/${route.icon}-solid.svg` : `/icons/${route.icon}-outline.svg`} className={"w-8 h-8 invert"} alt={"icon"}/>
                        </div>
                    })
                }

            </motion.div>
        </div>
    )
}