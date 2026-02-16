"use client";
import { useEffect, useState } from "react";
import { motion, useMotionValue } from "framer-motion";

export default function CustomCursor() {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const [isHovering, setIsHovering] = useState(false);

    useEffect(() => {
        const moveCursor = (e: MouseEvent) => {
            mouseX.set(e.clientX - 16); // Center the 32x32 cursor
            mouseY.set(e.clientY - 16);
        };

        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const isClickable =
                target.tagName === 'A' ||
                target.tagName === 'BUTTON' ||
                target.closest('a') ||
                target.closest('button') ||
                target.getAttribute('role') === 'button' ||
                target.getAttribute('type') === 'submit';

            setIsHovering(!!isClickable);
        };

        window.addEventListener("mousemove", moveCursor);
        window.addEventListener("mouseover", handleMouseOver);

        return () => {
            window.removeEventListener("mousemove", moveCursor);
            window.removeEventListener("mouseover", handleMouseOver);
        };
    }, [mouseX, mouseY]);

    return (
        <motion.div
            className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference text-white"
            style={{
                x: mouseX,
                y: mouseY,
            }}
        >
            {isHovering ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22 11c-4.96 0-9-4.04-9-9 0-1.32-2-1.32-2 0 0 4.96-4.04 9-9 9-1.32 0-1.32 2 0 2 4.96 0 9 4.04 9 9 0 1.32 2 1.32 2 0 0-4.96 4.04-9 9-9 1.32 0 1.32-2 0-2Z" />
                </svg>
            ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22 11c-4.96 0-9-4.04-9-9 0-1.32-2-1.32-2 0 0 4.96-4.04 9-9 9-1.32 0-1.32 2 0 2 4.96 0 9 4.04 9 9 0 1.32 2 1.32 2 0 0-4.96 4.04-9 9-9 1.32 0 1.32-2 0-2Z" />
                </svg>
            )}
        </motion.div>
    );
}
