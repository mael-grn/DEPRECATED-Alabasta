"use client";

import {forwardRef, useEffect, useImperativeHandle, useRef, useState} from "react";
import {Player} from "@lordicon/react";

const LordIcon = forwardRef(({ iconName, animationType = 'none' }, ref) => {

    useImperativeHandle(ref, () => ({
        triggerAnimation() {
            if (playerRef.current) {
                playerRef.current.playFromBeginning();
            }
        },
    }));

    const playerRef = useRef(null);
    const ICON = require(`/public/icons/${iconName}.json`);

    const [isLoop, setIsLoop] = useState(animationType === 'loop');
    const [isHover, setIsHover] = useState(animationType === 'hover');

    useEffect(() => {
        if (playerRef.current) {
            playerRef.current.playFromBeginning();
        }
    }, [])

    return (
        <span style={{cursor: "pointer"}} onMouseEnter={() => {
            if (animationType === "hover") playerRef.current.playFromBeginning()
        }}>
            <Player
                ref={playerRef}
                icon={ICON}
                onComplete={() => {
                    if (isLoop) playerRef.current?.playFromBeginning()
                }}
            />
        </span>
    );
});

export default LordIcon;