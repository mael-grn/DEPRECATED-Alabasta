'use client';
import {MotionConfig} from 'framer-motion';

export default function MotionProvider({children}: { children: React.ReactNode }) {

    return (
        <MotionConfig transition={{duration: 1, type: "tween"}}>
            {children}
        </MotionConfig>
    );
}