"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";

const suggestions = [
    "Why do my relationships follow the same pattern?",
];

type Message = {
    role: "user" | "assistant";
    content: string;
};

interface HeroInputInterfaceProps {
    onSendMessage: (message: string) => void;
    isDisabled?: boolean;
}

export default function HeroInputInterface({ onSendMessage, isDisabled }: HeroInputInterfaceProps) {
    const [inputValue, setInputValue] = useState("");
    const [placeholderIndex, setPlaceholderIndex] = useState(0);
    const [charIndex, setCharIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [hasInteracted, setHasInteracted] = useState(false);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    // Typewriter effect & Auto-send
    useEffect(() => {
        if (isFocused || hasInteracted || isDisabled) return;

        const currentText = suggestions[placeholderIndex];
        const typeSpeed = isDeleting ? 50 : 100;
        const pauseTime = 1500;

        const timeout = setTimeout(() => {
            if (!isDeleting && charIndex === currentText.length) {
                // Finished typing
                if (!hasInteracted) {
                    // Auto-send logic
                    setTimeout(() => {
                        if (!hasInteracted && !isFocused) {
                            handleSend(currentText);
                        } else {
                            // User intervened, just wait for delete
                            setIsDeleting(true);
                        }
                    }, 1000);
                } else {
                    setTimeout(() => setIsDeleting(true), pauseTime);
                }
            } else if (isDeleting && charIndex === 0) {
                // Finished deleting, move to next string
                setIsDeleting(false);
                setPlaceholderIndex((prev) => (prev + 1) % suggestions.length);
            } else {
                setCharIndex((prev) => prev + (isDeleting ? -1 : 1));
                setInputValue(currentText.substring(0, charIndex + (isDeleting ? -1 : 1)));
            }
        }, typeSpeed);

        return () => clearTimeout(timeout);
    }, [charIndex, isDeleting, placeholderIndex, isFocused, hasInteracted, isDisabled]);

    const handleSend = (text: string = inputValue) => {
        const messageToSend = text.trim();
        if (!messageToSend) return;

        setInputValue("");
        setHasInteracted(true);
        // Force focus to stop typewriter if it was auto-sent
        setIsFocused(true);
        onSendMessage(messageToSend);
    };

    return (
        <div className="w-full mx-auto">
            {/* Input Bar */}
            <motion.div
                layout
                className={`relative flex items-end bg-[#f4f4f4] rounded-full px-3 py-2 sm:px-4 sm:py-3 shadow-inner border border-black/5 transition-all ${isFocused ? "ring-2 ring-cosmic-purple/20 bg-white" : ""
                    }`}
            >
                {/* Attach Button */}
                <button
                    className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full text-[#b4b4b4] hover:text-foreground hover:bg-black/5 transition-colors flex-shrink-0 mb-0.5"
                    aria-label="Attach file"
                    disabled={isDisabled}
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 sm:w-5 sm:h-5">
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                </button>

                {/* Text Input */}
                <textarea
                    ref={inputRef}
                    value={inputValue}
                    onChange={(e) => {
                        setInputValue(e.target.value);
                        setHasInteracted(true);
                        if (!isFocused) setIsFocused(true);
                    }}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => {
                        if (!inputValue) setIsFocused(false);
                    }}
                    placeholder={isFocused ? "Ask the stars anything..." : ""}
                    rows={1}
                    disabled={isDisabled}
                    className="flex-1 bg-transparent border-none text-foreground placeholder-[#b4b4b4] px-2 sm:px-3 py-1.5 text-sm sm:text-base focus:outline-none focus:ring-0 resize-none leading-relaxed max-h-[200px] overflow-y-auto"
                    style={{ minHeight: "36px" }}
                    onInput={(e) => {
                        const target = e.target as HTMLTextAreaElement;
                        target.style.height = "auto";
                        target.style.height = Math.min(target.scrollHeight, 200) + "px";
                    }}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleSend();
                        }
                    }}
                />

                {/* Send Button */}
                <button
                    onClick={() => handleSend()}
                    disabled={(!inputValue.trim() && !(!hasInteracted && !isFocused && inputValue)) || isDisabled}
                    className={`flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full transition-all flex-shrink-0 mb-0.5 ${inputValue.trim() || (!hasInteracted && !isFocused && inputValue)
                        ? "bg-foreground text-white hover:bg-foreground/80 scale-100"
                        : "bg-[#e0e0e0] text-[#a0a0a0] scale-90"
                        }`}
                    aria-label="Send message"
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 sm:w-4 sm:h-4">
                        <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
                    </svg>
                </button>
            </motion.div>
        </div>
    );
}
