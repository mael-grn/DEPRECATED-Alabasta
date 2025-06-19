'use client';

import {useRouter} from "next/navigation";

export interface pageProps {
    children: React.ReactNode;
    title?: string;
    pageAlignment?: PageAlignmentEnum;

}

export enum PageAlignmentEnum {
    start,
    center,
    tileStart,
    tileCenter,
}

export default function MainPage({children, title, pageAlignment=PageAlignmentEnum.start}: pageProps) {

    const router = useRouter();

    return (
        <main className={"flex items-start justify-start flex-col gap-6 p-6 mb-20"}>
            {title && <>
                <div className="flex gap-4 items-center">
                    <button
                        className="flex gap-2 items-center justify-center border-1 border-on-background-hover pl-4 pr-4 pt-2 pb-2 bg-on-background rounded-lg md:hover:bg-on-background-hover active:bg-on-background-hover cursor-pointer"
                        onClick={() => router.back()}
                    >
                        <img src="/icons/arrow-back.svg" alt="Back" className="w-4 invert" />
                        <span>Retour</span>
                    </button>
                    <h1 className={"line-clamp-2"}>{title}</h1>
                </div>
                <hr className={"border-0 h-[1px] w-full bg-on-background-hover"}/>
            </>}
            <div className={`p-3 w-full flex gap-5  ${pageAlignment === PageAlignmentEnum.center ? 'justify-center items-center flex-col' : pageAlignment === PageAlignmentEnum.start ? 'justify-start items-start flex-col' : pageAlignment === PageAlignmentEnum.tileCenter ? 'justify-center items-center flex-wrap' : 'justify-start items-start flex-wrap'}`}>
                {children}
            </div>
        </main>
    );
}