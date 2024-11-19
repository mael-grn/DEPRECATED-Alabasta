"use client";

import {forwardRef, useEffect, useImperativeHandle, useRef, useState} from "react";
import {Player} from "@lordicon/react";

const LordIcon = forwardRef(({ iconName, inAnimation, defaultAnimation, animationType, size = 35}, ref) => {

    useImperativeHandle(ref, () => ({
        triggerAnimation() {
            if (playerRef.current) {
                playerRef.current.playFromBeginning();
            }
        },
    }));

    const playerRef = useRef(null);
    const ICON = require(`/public/icons/${iconName}.json`);
    const [state, setState] = useState("");
    const [isLoop, setIsLoop] = useState(animationType === 'loop');
    const [isHover, setIsHover] = useState(animationType === 'hover');

    useEffect(() => {
        if (playerRef.current) {
            if (!inAnimation) {
                inAnimation = playerRef.current._states.find(element => element.name.startsWith("in"))?.name
            }
            setState(inAnimation);

            if (!defaultAnimation) {
                defaultAnimation = playerRef.current._states.find(element => element.name.startsWith(animationType))?.name
            }

            playerRef.current.playFromBeginning();
        }
    }, [])

    return (
        <span style={{cursor: "pointer"}} onMouseEnter={() => {
            if (animationType === "hover") playerRef.current.playFromBeginning()
        }}>
            <Player
                ref={playerRef}
                size={size}
                icon={ICON}
                state={state}
                onComplete={() => {
                    setState(defaultAnimation)
                    if (isLoop) playerRef.current?.playFromBeginning()
                }}
            />
        </span>
    );
});

export default LordIcon;