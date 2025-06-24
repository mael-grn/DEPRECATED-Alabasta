'use client';

import Button, {ButtonProps} from "@/app/components/Button";
import {AnimatePresence, motion} from "framer-motion";

export default function Section({title, actions, loading=false, children}: {title?: string, loading?: boolean, actions?: ButtonProps[], children: React.ReactNode }) {

    return (
        <div className={"md:w-fit flex-1 w-full"}>
            <div className={`w-full relative p-6 bg-on-background border-[1px] border-on-background-hover ${actions ? "rounded-t-xl" : "rounded-xl"} flex gap-3 flex-col overflow-hidden`}>
                {title && <h2 className="text-2xl font-bold mb-4">{title}</h2>}
                <AnimatePresence>
                    {
                        loading &&
                        <motion.div
                            initial={{opacity: 0}}
                            animate={{opacity: 1}}
                            exit={{opacity: 0}}
                            className={"backdrop-blur absolute w-full h-full top-0 left-0 z-10 flex justify-center items-center"}
                        >
                            <img src={"/icons/loader-light.gif"} alt={"loading"} className={"w-10"}/>
                        </motion.div>
                    }
                </AnimatePresence>
                {children}
            </div>
            {
                actions && actions.length > 0 &&
                <div className={"rounded-b-xl p-3 bg-on-background border-[1px] border-t-0 border-on-background-hover flex gap-3 justify-end items-center"}>
                    {
                        actions.map((action, index) => <Button key={index} iconName={action.iconName} text={action.text} onClick={action.onClick} actionType={action.actionType} isForm={action.isForm} isSecondary={action.isSecondary} isLoading={action.isLoading} />)
                    }
                </div>
            }
        </div>
    );
}