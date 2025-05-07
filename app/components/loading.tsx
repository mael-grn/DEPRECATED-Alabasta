import {AnimatePresence, motion} from "framer-motion";

interface LoadingProps {
    showLoading: boolean;
}

export default function Loading({showLoading}: LoadingProps) {
    return (
        <div>
            <AnimatePresence>
                {
                    showLoading &&
                    <motion.div
                        className={"fixed top-0 left-0 w-full h-[100vh] bg-background-opacity flex items-center justify-center"}
                        key="popup-bg"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className={"p-8 flex flex-col justify-center items-center bg-on-background gap-6 relative rounded-3xl"}
                            key="popup"
                            initial={{ transform: "scale(0)" }}
                            animate={{ transform: "scale(1)" }}
                            exit={{ transform: "scale(0)" }}
                        >
                            <img alt={"loading"} src={"/icons/loader-light.gif"} className={"w-16 h-16"}/>
                        </motion.div>
                    </motion.div>
                }
            </AnimatePresence>
        </div>
    )
}