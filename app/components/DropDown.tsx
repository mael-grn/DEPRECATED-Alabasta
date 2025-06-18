'use client';

import {useState} from "react";

export default function DropDown({
                                     items,
                                     selectedItem,
                                     setSelectedItemAction,
                                 }: {
    items: string[],
    selectedItem: string,
    setSelectedItemAction: (newValue: string) => void,
}) {

    const [showItems, setShowItems] = useState(false);
    return (
        <div className={"relative"}>
            <div
                className={` pt-2 pb-2 pl-3 pr-3 rounded-lg bg-on-background w-fit flex items-center justify-between gap-2 cursor-pointer md:hover:bg-on-background-hover target:bg-on-background-hover`}
                onMouseUp={() => setShowItems(!showItems)}
            >
                {selectedItem}
                <img src={"/icons/chevron-up-down.svg"} alt={"drown-down"} className={"h-4 w-4 invert"}/>
            </div>
            {
                showItems &&(
                    <ul className={"top-0 left-0 rounded-lg absolute bg-on-background-hover w-fit h-fit p-2 flex flex-col gap-2"}>
                        {
                            items.map((item, index) => (
                                <li
                                    key={index}
                                    className={`p-2 rounded-lg cursor-pointer  ${selectedItem === item ? "bg-foreground text-background" : "md:hover:bg-background"}`}
                                    onMouseUp={() => {
                                        setSelectedItemAction(item);
                                        setShowItems(false);
                                    }}
                                >
                                    {item}
                                </li>
                            ))
                        }
                    </ul>
                )
            }
        </div>


    );
}