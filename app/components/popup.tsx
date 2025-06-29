import {AnimatePresence, motion} from "framer-motion";
import Button, {ActionTypeEnum, ButtonProps} from "@/app/components/Button";

export default function Popup({show, icon="info", title, message, closePopup, actions} : {show: boolean, icon?: string, message: string, title: string, closePopup: () => void, actions?: ButtonProps[]}) {
    return (
        <AnimatePresence>
            {
                show && <motion.div
                    className={"fixed top-0 left-0 w-full h-full flex items-center justify-center bg-background-opacity backdrop-blur z-50"}
                    initial={{opacity: 0}}
                    animate={{opacity: 1}}
                    exit={{opacity: 0}}
                >
                    <motion.div
                        className={"flex flex-col items-center justify-center gap-4 p-6 bg-background rounded-2xl md:w-1/3"}
                        initial={{transform: "scale(0.5)"}}
                        animate={{transform: "scale(1)"}}
                        exit={{transform: "scale(0.5)"}}
                    >
                        <img src={`/icons/${icon}.svg`} alt={"popup"} className={"w-16 invert"} />
                        <h2 className={"text-center"}>{title}</h2>
                        <p className={"text-center"}>{message}</p>
                        <div className={"flex flex-1 gap-2 items-center justify-center"}>
                            <Button iconName={"close"} text={"Fermer"} actionType={ActionTypeEnum.dangerous} onClick={closePopup} />
                            {
                                actions && actions.map((action, index) => (
                                    <Button
                                        key={index}
                                        iconName={action.iconName}
                                        text={action.text}
                                        onClick={action.onClick}
                                        actionType={action.actionType}
                                        isForm={action.isForm}
                                        isLoading={action.isLoading}
                                    />
                                ))
                            }
                        </div>
                    </motion.div>
                </motion.div>
            }
        </AnimatePresence>
    );

}