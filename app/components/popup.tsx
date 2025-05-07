import {AnimatePresence, motion} from "framer-motion";

interface PopupProps {
    showPopup: boolean;
    onClose: () => void;
    titre: string;
    texte: string;
}

export default function Popup({showPopup, onClose, titre, texte}: PopupProps) {
    return (
        <div>
            <AnimatePresence>
                {
                    showPopup &&
                        <motion.div
                            className={"fixed top-0 left-0 w-full h-[100vh] bg-background-opacity flex items-center justify-center"}
                            key="popup-bg"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <motion.div
                                className={"p-8 pt-16 flex flex-col justify-center items-center bg-on-background gap-6 relative rounded-3xl min-w-1/3 max-w-3/4"}
                                key="popup"
                                initial={{ transform: "scale(0)" }}
                                animate={{ transform: "scale(1)" }}
                                exit={{ transform: "scale(0)" }}
                            >
                                <span onClick={onClose} className={"bg-primary w-8 h-8 rounded-3xl flex items-center justify-center absolute top-4 right-4 cursor-pointer md:hover:bg-secondary active:scale-75"}>
                                    <img alt={"loading"} src={"/icons/close.svg"} className={"w-6 h-6"}/>
                                </span>
                                <h1 className={"text-center"}>{titre}</h1>
                                <p className={"text-center"}>{texte}</p>
                            </motion.div>
                        </motion.div>
                }
            </AnimatePresence>
        </div>
    )
}