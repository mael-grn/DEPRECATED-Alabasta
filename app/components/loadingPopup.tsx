import {AnimatePresence, motion} from "framer-motion";

export default function LoadingPopup({show} : {show: boolean}) {
    return (
        <AnimatePresence>
            {
                show &&
                <motion.div
                    initial={{ opacity: 0}}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={"fixed top-0 left-0 w-full h-full flex items-center justify-center bg-background-opacity backdrop-blur z-50"}>
                    <motion.img
                        initial={{transform: "scale(0)"}}
                        animate={{transform: "scale(1)"}}
                        exit={{transform: "scale(0)"}}
                        src={"/icons/loader-light.gif"}
                        alt={"loader-light"}
                        className={"w-10"} />
                </motion.div>
            }

        </AnimatePresence>
    );

}