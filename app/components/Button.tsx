'use client';
export default function Button({iconName, text, onClick, isSecondary}: { iconName: string, text: string, animationDelay? : number, onClick?: () => void, isSecondary?: boolean }) {

    return (
        <button
            className={`flex gap-3 cursor-pointer items-center justify-center pt-3 pb-3 pl-6 pr-6 ${isSecondary ? "bg-secondary" : "bg-primary"} rounded-xl ${isSecondary ? "md:hover:bg-secondary-hover" : "md:hover:bg-primary-hover"} ${isSecondary ? "active:bg-secondary-hover" : "active:bg-primary-hover"}  `}
            onClick={onClick}
        >
            <img src={`/icons/${iconName}.svg`} alt={iconName} className={"w-6 invert"} />
            {text}
        </button>
    );
}