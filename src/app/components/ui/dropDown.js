'use client'

import {useRef, useState} from "react";
import styles from "@/app/components/ui/dropDown.module.css"
import LordIcon from "@/app/components/ui/lordIcon";
export default function DropDown({optionList, defaultOptionIndex = 0, onSelect}) {
    const [selectedOption, setSelectedOption] = useState(optionList[defaultOptionIndex]);
    const [showOptions, setShowOptions] = useState(false);
    const downBtnRef = useRef(null);

    const toggleOptions = () => {
        setShowOptions(!showOptions);
    }

    const selectOption = (option) => {
        setSelectedOption(option);
        setShowOptions(false);
        onSelect(optionList.indexOf(option));
    }

    function truncateString(str, maxLength = 30) {
        if (str.length > maxLength) {
            return str.slice(0, maxLength) + "...";
        }
        return str;
    }

    return (
        <div className={`${styles.dropDown} ${showOptions ? styles.developped : null}`}>

            {showOptions ? (
                <div className={styles.elementsDiv}>
                    <div className={styles.element}
                         onClick={() => setShowOptions(false)}>Fermer
                    </div>
                    {optionList.map((option, index) => (
                        <div className={styles.element} key={index}
                             onClick={() => selectOption(option)}>{truncateString(option)}</div>
                    ))}
                </div>
            ) : (<div onClick={toggleOptions} onMouseEnter={() => {
                if (downBtnRef) downBtnRef.current.triggerAnimation()
            }}>
                <LordIcon size={30} iconName={"circleArrow-black"} animationType={"hover"} ref={downBtnRef}/>
                <span>{truncateString(selectedOption)}</span>
            </div>)
            }
        </div>
    )

}