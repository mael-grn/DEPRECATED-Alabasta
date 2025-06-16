'use client';
export default function Button({iconName, text, onClick, isSecondary, isForm = false, isLoading}: { iconName: string, text: string, animationDelay? : number, onClick?: () => void, isSecondary?: boolean, isForm?: boolean, isLoading?: boolean }) {

    return (
        <button
            disabled={isLoading}
            type={isForm ? "submit" : "button"}
            className={`flex gap-2 cursor-pointer items-center justify-center pt-3 pb-3 pl-6 pr-6 ${isSecondary ? "bg-secondary" : "bg-primary"} rounded-xl ${isSecondary ? "md:hover:bg-secondary-hover" : "md:hover:bg-primary-hover"} ${isSecondary ? "active:bg-secondary-hover" : "active:bg-primary-hover "} disabled:cursor-default `}
            onClick={onClick}
        >
            {
                isLoading ? <img src={"/icons/loader-light.gif"} alt={"loader-light"} className={"w-6"} /> :
                    <>
                        <img src={`/icons/${iconName}.svg`} alt={iconName} className={"w-6 invert"} />
                        {text}
                    </>
            }
        </button>
    );
}