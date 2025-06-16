'use client';

import {useState} from "react";

export default function Input({
                                  iconName,
                                  placeholder,
                                  value,
                                  setValueAction,
                                  type,
    validatorAction = () => null,
                              }: {
    iconName?: string,
    placeholder: string,
    value: string,
    setValueAction: (newValue: string) => void,
    validatorAction?: (value: string) => string | null,
    type?: string
}) {

    const [showDetails, setShowDetails] = useState(false);
    return (
        <div
            className={`relative pl-16`}
        >
            <div
                className={`absolute top-0 left-0 flex gap-2 p-3 ${validatorAction(value) && value.length > 0 ? 'bg-primary' : value.length == 0 ? "bg-on-background" : "bg-secondary"} rounded-lg h-14 w-fit  items-center justify-start`}
                onMouseEnter={() => setShowDetails(true)}
                onMouseLeave={() => setShowDetails(false)}
            >
                <img src={validatorAction(value) && value.length > 0 ? "/icons/error.svg" : `/icons/${iconName}.svg` || "/icons/info.svg"} alt={iconName || "text-input"} className={"invert h-8"}/>
                {showDetails && <p>{validatorAction(value) ? (validatorAction(value)) : placeholder}</p>}
            </div>
            <input
                className={"p-3 rounded-lg md:hover:bg-on-background-hover bg-on-background target:bg-on-background-hover outline-none target:outline-none w-fit h-14"}
                type={type || "text"}
                value={value}
                onChange={(e) => setValueAction(e.target.value)}
                placeholder={placeholder}
            />
        </div>

    );
}