"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";

interface IntroSequenceProps {
    onComplete: () => void;
}

const sequenceData = [
    {
        id: 1,
        title: "History",
        lines: [
            "For thousands of years, people looked at the sky to understand life.",
            "Greek scholars used astrology to guide kings.",
            "In India, birth charts have been part of daily life for centuries.",
            "Across cultures, the stars were seen as a map, not a myth.",
        ],
        gridArea: "top-left",
    },
    {
        id: 2,
        title: "The Modern Problem",
        lines: [
            "But today, astrology is mostly reduced to daily horoscopes.",
            "Short, generic messages that could apply to anyone.",
            "Most people never see their real birth chart.",
        ],
        gridArea: "top-right",
    },
    {
        id: 3,
        title: "The Truth",
        lines: [
            "But your birth chart is not random.",
            "It is based on the exact positions of the planets when you were born.",
            "A unique pattern that never repeats.",
            "No one else has the same sky as you.",
        ],
        gridArea: "bottom-left",
    },
    {
        id: 4,
        title: "The Modern Twist",
        lines: [
            "Now, AI can read your chart in seconds.",
            "And turn it into insights you can actually use.",
        ],
        gridArea: "bottom-right",
    },
];

export default function IntroSequence({ onComplete }: IntroSequenceProps) {
    // Stages: 0 (black), 1 (image fade in), 2 (text sequence), 3 (final CTA), 4 (complete)
    const [stage, setStage] = useState(0);
    const [activeBlockIndex, setActiveBlockIndex] = useState(-1);
    const [visibleLines, setVisibleLines] = useState<number>(0);

    // Multiplier for animation speed (1 = normal, 0.6 = fast/mobile)
    const [speedMultiplier, setSpeedMultiplier] = useState(1);

    useEffect(() => {
        // Check screen size on mount to determing speed
        if (window.innerWidth < 768) {
            setSpeedMultiplier(0.5); // 2x faster on mobile
        }
    }, []);

    useEffect(() => {
        const startTimer = setTimeout(() => {
            setStage(1);
        }, 500 * speedMultiplier);
        return () => clearTimeout(startTimer);
    }, [speedMultiplier]);

    useEffect(() => {
        if (stage === 1) {
            const timer = setTimeout(() => {
                setStage(2);
                setActiveBlockIndex(0);
            }, 2000 * speedMultiplier);
            return () => clearTimeout(timer);
        }
    }, [stage, speedMultiplier]);

    useEffect(() => {
        if (stage !== 2 || activeBlockIndex === -1) return;

        if (activeBlockIndex >= sequenceData.length) {
            const timer = setTimeout(() => {
                setStage(3);
            }, 1000 * speedMultiplier);
            return () => clearTimeout(timer);
        }

        const currentBlock = sequenceData[activeBlockIndex];
        if (visibleLines < currentBlock.lines.length) {
            const lineTimer = setTimeout(() => {
                setVisibleLines((prev) => prev + 1);
            }, 1500 * speedMultiplier);
            return () => clearTimeout(lineTimer);
        } else {
            const blockTimer = setTimeout(() => {
                setActiveBlockIndex((prev) => prev + 1);
                setVisibleLines(0);
            }, 2000 * speedMultiplier);
            return () => clearTimeout(blockTimer);
        }
    }, [stage, activeBlockIndex, visibleLines, speedMultiplier]);

    useEffect(() => {
        if (stage === 3) {
            const timer = setTimeout(() => {
                setStage(4);
                setTimeout(onComplete, 1000 * speedMultiplier);
            }, 5000 * speedMultiplier);
            return () => clearTimeout(timer);
        }
    }, [stage, onComplete, speedMultiplier]);

    const audioRef = useRef<HTMLAudioElement>(null);
    const [isMuted, setIsMuted] = useState(false);

    // Handle background music
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        // Set initial volume and start time
        audio.volume = 0.5;
        audio.currentTime = 26;

        // Try to play automatically
        const playPromise = audio.play();

        if (playPromise !== undefined) {
            playPromise.catch(() => {
                // Auto-play was prevented
                // User requested "always audio enabled", so we keep isMuted=false
                // forcing the UI to show enabled state. 
                // Interaction will be needed to actually start it if blocked.
            });
        }

        return () => {
            audio.pause();
        };
    }, []);

    // Fade out audio on completion
    useEffect(() => {
        if (stage === 4 && audioRef.current) {
            const audio = audioRef.current;
            const fadeTotalTime = 2000; // 2s fade out
            const fadeInterval = 50;
            const fadeStep = 0.05; // volume decrement

            const fadeOut = setInterval(() => {
                if (audio.volume > 0.05) {
                    audio.volume -= fadeStep;
                } else {
                    audio.volume = 0;
                    audio.pause();
                    clearInterval(fadeOut);
                }
            }, fadeInterval);

            return () => clearInterval(fadeOut);
        }
    }, [stage]);

    const toggleMute = () => {
        if (audioRef.current) {
            audioRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
            if (isMuted) audioRef.current.play();
        }
    };

    const handleSkip = () => {
        setStage(4);
        onComplete();
    };

    return (
        <AnimatePresence>
            {stage < 4 && (
                <motion.div
                    className="fixed inset-0 z-50 flex flex-col bg-black text-white overflow-hidden"
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1 }}
                >
                    <audio
                        ref={audioRef}
                        src="/background-music.mp3"
                        loop
                    />

                    {/* Background Image */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: stage >= 1 ? 1 : 0 }}
                        transition={{ duration: 2, ease: "easeOut" }}
                        className="absolute inset-0 z-0"
                    >
                        <Image
                            src="/section1image1.jpg"
                            alt="Cosmic Background"
                            fill
                            className="object-cover opacity-60"
                            priority
                        />
                        <div className="absolute inset-0 bg-black/40" />
                    </motion.div>

                    {/* Main Content Container with Scroll for Safety on Small Mobile */}
                    <div className="relative z-10 w-full h-full overflow-y-auto overflow-x-hidden">
                        <div className="min-h-full flex flex-col p-6 md:p-12 lg:p-20">

                            {stage === 2 && (
                                <div className="flex-1 flex flex-col md:grid md:grid-cols-2 md:grid-rows-2 gap-6 md:gap-8 w-full max-w-7xl mx-auto">
                                    {sequenceData.map((block, index) => {
                                        const isActive = index === activeBlockIndex;
                                        const isPast = index < activeBlockIndex;

                                        return (
                                            <div
                                                key={block.id}
                                                className={`
                            flex flex-col justify-center transition-all duration-500
                            ${/* Desktop Alignment */ ""}
                            ${block.id === 1 ? "md:items-start md:text-left" :
                                                        block.id === 2 ? "md:items-end md:text-right" :
                                                            block.id === 3 ? "md:items-start md:text-left" :
                                                                "md:items-end md:text-right"
                                                    } 
                            ${/* Mobile Alignment: Always Center */ ""}
                            items-center text-center
                            ${/* Mobile: dimmed non-active to focus attention? Or just reduce opacity slightly less? */ ""}
                            ${isActive ? "flex-grow md:flex-grow-0 opacity-100" : "flex-shrink opacity-60 md:opacity-100"}
                          `}
                                            >
                                                <AnimatePresence mode="wait">
                                                    {(isActive || isPast) && (
                                                        <motion.div
                                                            initial={{ opacity: 0 }}
                                                            animate={{ opacity: 1 }}
                                                            className="max-w-md space-y-3 md:space-y-4"
                                                        >
                                                            {block.lines.map((line, lineIndex) => (
                                                                <motion.p
                                                                    key={lineIndex}
                                                                    initial={{ opacity: 0, y: 10 }}
                                                                    animate={{
                                                                        opacity: (isPast || (isActive && lineIndex < visibleLines)) ? 1 : 0,
                                                                        y: (isPast || (isActive && lineIndex < visibleLines)) ? 0 : 10
                                                                    }}
                                                                    transition={{ duration: 0.8 }}
                                                                    className={`
                                      font-light leading-relaxed text-white/90
                                      ${isActive ? "text-lg md:text-2xl scale-100" : "text-base md:text-2xl scale-95 md:scale-100"}
                                      transition-all duration-500
                                    `}
                                                                >
                                                                    {line}
                                                                </motion.p>
                                                            ))}
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            {/* Final CTA */}
                            {stage === 3 && (
                                <div className="flex-1 flex flex-col items-center justify-center text-center">
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 1 }}
                                        className="space-y-6 max-w-2xl px-4"
                                    >
                                        <p className="text-3xl md:text-5xl font-editorial leading-tight">
                                            Your chart already exists.
                                        </p>
                                        <motion.p
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 1.5, duration: 1 }}
                                            className="text-xl md:text-3xl text-cosmic-lavender font-light"
                                        >
                                            We just help you understand it.
                                        </motion.p>
                                    </motion.div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Controls Container */}
                    <div className="absolute bottom-6 right-6 z-50 flex items-center gap-4">
                        {/* Mute Toggle */}
                        <motion.button
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.7 }}
                            whileHover={{ opacity: 1 }}
                            onClick={toggleMute}
                            className="text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
                        >
                            {isMuted ? (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 9.75 19.5 12m0 0 2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6 4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" />
                                </svg>
                            )}
                        </motion.button>

                        {/* Skip Button */}
                        <motion.button
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.5 }}
                            whileHover={{ opacity: 1 }}
                            onClick={handleSkip}
                            className="text-xs uppercase tracking-widest text-white/50 border border-white/20 px-4 py-2 rounded-full hover:bg-white/10 transition-colors"
                        >
                            Skip
                        </motion.button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
