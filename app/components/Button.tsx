'use client';

export interface ButtonProps {
    iconName: string;
    text: string;
    onClick?: () => void;
    actionType?: ActionTypeEnum;
    isForm?: boolean;
    isLoading?: boolean;
    isSecondary?: boolean;
}

export enum ActionTypeEnum {
    dangerous,
    safe
}

export default function Button({iconName, text, onClick, actionType, isSecondary=false, isForm = false, isLoading}:ButtonProps) {

    return (
        <button
            disabled={isLoading}
            type={isForm ? "submit" : "button"}
            className={`flex  gap-2 cursor-pointer text-background items-center justify-center pt-2 pb-2 pl-4 pr-4 ${actionType === undefined ? isSecondary ? "bg-background text-foreground border-1 border-foreground md:hover:bg-on-background-hover active:bg-on-background-hover" : "bg-foreground md:hover:bg-on-foreground active:bg-on-foreground" : actionType === ActionTypeEnum.safe ? "bg-safe md:hover:bg-safe-hover active:bg-safe-hover" : "bg-dangerous md:hover:bg-dangerous-hover active:bg-dangerous"} rounded-lg disabled:cursor-default `}
            onClick={onClick}
        >
            {
                isLoading ? <img src={"/icons/loader-dark.gif"} alt={"loader-light"} className={"w-6"} /> :
                    <>
                        <img src={`/icons/${iconName}.svg`} alt={iconName} className={`w-5 ${isSecondary && "invert"}`} />
                        {text}
                    </>
            }
        </button>
    );
}