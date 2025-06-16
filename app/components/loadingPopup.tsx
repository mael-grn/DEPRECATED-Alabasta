import {AnimatePresence} from "framer-motion";

export default function LoadingPopup({show, message = "Chargement..."} : {show: boolean, message?: string }) {
    return (
        show && <AnimatePresence>
            <div className={"fixed top-0 left-0 w-full h-full flex items-center justify-center bg-background-opacity backdrop-blur z-50"}>
                <div className={"flex flex-col items-center justify-center gap-4 p-6 bg-background rounded-2xl"}>
                    <img src={"/icons/loader-light.gif"} alt={"loader-light"} className={"w-10"} />
                    <p>{message}</p>
                </div>
            </div>
        </AnimatePresence>
    );

}