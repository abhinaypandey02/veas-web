"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const TYPING_SPEED = 50; // ms per character
const QUESTION = "What does my Saturn return mean for my career?";
const ANSWER =
    "Your Saturn return in the 10th house signals a pivotal career maturation. Expect increased responsibility and a push towards your true authority.";

export default function HeroChatDemo() {
    const [displayedQuestion, setDisplayedQuestion] = useState("");
    const [showAnswer, setShowAnswer] = useState(false);
    const [isTyping, setIsTyping] = useState(false);

    useEffect(() => {
        let timeout: NodeJS.Timeout;

        const startTyping = () => {
            setIsTyping(true);
            setDisplayedQuestion("");
            setShowAnswer(false);

            let charIndex = 0;
            const typeChar = () => {
                if (charIndex < QUESTION.length) {
                    setDisplayedQuestion(QUESTION.slice(0, charIndex + 1));
                    charIndex++;
                    timeout = setTimeout(typeChar, TYPING_SPEED);
                } else {
                    setIsTyping(false);
                    timeout = setTimeout(() => {
                        setShowAnswer(true);
                        // Reset after some time to loop
                        timeout = setTimeout(startTyping, 6000);
                    }, 800); // Delay before answer appears
                }
            };

            // Initial delay before typing starts
            timeout = setTimeout(typeChar, 1000);
        };

        startTyping();

        return () => clearTimeout(timeout);
    }, []);

    return (
        <div className="w-full max-w-md mx-auto">
            <div className="relative rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-4 shadow-xl overflow-hidden">
                {/* Chat Interface */}
                <div className="flex flex-col gap-4">

                    {/* User Question Bubble */}
                    <div className="flex justify-end">
                        <div className="bg-white/20 text-white rounded-2xl rounded-tr-sm px-4 py-2 max-w-[85%] text-sm sm:text-base">
                            {displayedQuestion}
                            {isTyping && (
                                <motion.span
                                    animate={{ opacity: [0, 1, 0] }}
                                    transition={{ repeat: Infinity, duration: 0.8 }}
                                    className="inline-block w-0.5 h-4 ml-1 bg-white align-middle"
                                />
                            )}
                        </div>
                    </div>

                    {/* AI Answer Bubble */}
                    <AnimatePresence>
                        {showAnswer && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                className="flex justify-start"
                            >
                                <div className="bg-cosmic-purple/80 text-white rounded-2xl rounded-tl-sm px-4 py-3 max-w-[90%] text-sm sm:text-base shadow-lg border border-white/10">
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-[8px]">
                                            ✦
                                        </div>
                                        <span className="text-[10px] uppercase tracking-wider opacity-70">Veas AI</span>
                                    </div>
                                    {ANSWER}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
