'use client'

import { useEffect } from 'react';
import Lenis from "lenis";

export default function LenisScroll() {

    useEffect(() => {
        const len = new Lenis();

        function raf(time) {
            len.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);

        return () => {
            len.destroy();
        };

    }, []);

    return null;
}