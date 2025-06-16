'use client';

import {motion} from "framer-motion";

export default function Input({
                                  iconName,
                                  placeholder,
                                  value,
                                  setValueAction,
                                  type
                              }: {
    iconName?: string,
    placeholder: string,
    value: string,
    setValueAction: (newValue: string) => void,
    isSecondary?: boolean,
    type?: string
}) {
    return (
        <div
            className={`flex cursor-pointer gap-3 items-center justify-start pt-3 pb-3 pl-6 pr-6`}
        >
            {iconName && <img src={iconName} alt={iconName}/>}
            <input
                type={type || "text"}
                value={value}
                onChange={(e) => setValueAction(e.target.value)}
                placeholder={placeholder}
            />
        </div>

    );
}