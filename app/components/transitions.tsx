'use client';

import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { ReactNode } from 'react';

interface TransitionWrapperProps {
    children: ReactNode;
}

const TransitionWrapper: React.FC<TransitionWrapperProps> = ({ children }) => {
    const pathname = usePathname(); // Utilisez usePathname

    const pageVariants = {
        initial: { opacity: 0, transform: "scale(0.8)" },
        animate: { opacity: 1, transform: "scale(1)" },
    };

    const pageTransition = {
        type: 'tween',
        ease: 'easeInOut',
        duration: 0.4,
    };

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={pathname} // Utilisez pathname comme clé
                initial="initial"
                animate="animate"
                variants={pageVariants}
                transition={pageTransition}
                className="transition-container"
            >
                {children}
            </motion.div>
        </AnimatePresence>
    );
};

export default TransitionWrapper;