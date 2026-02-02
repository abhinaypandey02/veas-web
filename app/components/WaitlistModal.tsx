"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface WaitlistModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function WaitlistModal({ isOpen, onClose }: WaitlistModalProps) {
    const [step, setStep] = useState<"waitlist" | "success">("waitlist");
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        interests: [] as string[],
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    const handleInterestToggle = (interest: string) => {
        setFormData(prev => ({
            ...prev,
            interests: prev.interests.includes(interest)
                ? prev.interests.filter(i => i !== interest)
                : [...prev.interests, interest]
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsSubmitting(true);

        try {
            // Simulate API call - replace with actual API endpoint
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Here you would typically send the data to your backend
            console.log("Waitlist signup:", formData);

            setStep("success");
        } catch (err) {
            console.error("Waitlist signup error:", err);
            setError("Something went wrong. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleReset = () => {
        setStep("waitlist");
        setFormData({
            name: "",
            email: "",
            interests: [],
        });
        setError("");
        setIsSubmitting(false);
    };

    if (!isOpen) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
            role="dialog"
            aria-modal="true"
        >
            {/* Enhanced Cosmic Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-purple-900/60 to-indigo-900/80 backdrop-blur-xl"
                onClick={onClose}
            />

            {/* Modal Card */}
            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                transition={{ type: "spring", duration: 0.6 }}
                className="relative w-full max-w-2xl max-h-[95vh] overflow-hidden bg-gradient-to-br from-slate-800/90 via-slate-900/90 to-slate-800/90 backdrop-blur-2xl border border-emerald-400/20 shadow-2xl"
                style={{ borderRadius: "24px" }}
            >
                {/* Animated Background Elements */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ borderRadius: "24px" }}>
                    <motion.div
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.1, 0.3, 0.1]
                        }}
                        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute -top-32 -right-32 w-64 h-64 bg-gradient-to-br from-emerald-400/20 to-cyan-400/20 rounded-full blur-3xl"
                    />
                    <motion.div
                        animate={{
                            scale: [1, 1.3, 1],
                            opacity: [0.05, 0.2, 0.05]
                        }}
                        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 3 }}
                        className="absolute -bottom-32 -left-32 w-64 h-64 bg-gradient-to-tr from-purple-400/15 to-pink-400/15 rounded-full blur-3xl"
                    />
                </div>

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute right-6 top-6 z-50 p-2.5 rounded-full bg-slate-700/50 backdrop-blur-sm border border-slate-600/50 text-slate-400 hover:text-white hover:bg-slate-600/50 hover:scale-110 transition-all duration-200 shadow-lg"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>

                {/* Content Container */}
                <div className="relative max-h-[95vh] overflow-y-auto p-8 sm:p-12">
                    <AnimatePresence mode="wait">
                        {/* Waitlist Form */}
                        {step === "waitlist" && (
                            <motion.div
                                key="waitlist"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="space-y-8"
                            >
                                {/* Header */}
                                <div className="text-center space-y-4">
                                    <motion.div
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ delay: 0.2 }}
                                        className="inline-flex items-center gap-3 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border border-emerald-400/30 rounded-full px-6 py-3 mb-6"
                                    >
                                        <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                                        <span className="font-mono text-sm uppercase tracking-widest text-emerald-400">
                                            Exclusive Early Access
                                        </span>
                                    </motion.div>

                                    <motion.h2
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3 }}
                                        className="font-serif text-4xl sm:text-5xl font-bold bg-gradient-to-r from-white via-emerald-200 to-cyan-200 bg-clip-text text-transparent leading-tight"
                                    >
                                        Join the Cosmic Revolution
                                    </motion.h2>

                                    <motion.p
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.4 }}
                                        className="font-sans text-slate-300 max-w-xl mx-auto leading-relaxed"
                                    >
                                        Be among the first to experience astrology aligned with the actual sky.
                                        Get exclusive early access to Veas and shape the future of cosmic guidance.
                                    </motion.p>
                                </div>

                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="p-5 bg-gradient-to-r from-red-900/50 to-rose-900/50 border border-red-500/30 rounded-xl backdrop-blur-sm"
                                    >
                                        <div className="flex items-start gap-3">
                                            <svg className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                            </svg>
                                            <p className="text-sm font-medium text-red-300">{error}</p>
                                        </div>
                                    </motion.div>
                                )}

                                <form onSubmit={handleSubmit} className="space-y-8 max-w-lg mx-auto">
                                    {/* Name Input */}
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.5 }}
                                        className="space-y-3"
                                    >
                                        <label htmlFor="name" className="block text-sm font-semibold font-mono uppercase tracking-wider text-emerald-400">
                                            Your Name
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            required
                                            placeholder="Enter your full name"
                                            className="w-full px-6 py-4 bg-slate-800/50 backdrop-blur-sm border-2 border-slate-600/50 rounded-2xl text-white placeholder:text-slate-400 focus:border-emerald-400/50 focus:bg-slate-700/50 focus:outline-none focus:ring-4 focus:ring-emerald-400/20 transition-all duration-300 font-medium"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </motion.div>

                                    {/* Email Input */}
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.6 }}
                                        className="space-y-3"
                                    >
                                        <label htmlFor="email" className="block text-sm font-semibold font-mono uppercase tracking-wider text-emerald-400">
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            required
                                            placeholder="your.email@example.com"
                                            className="w-full px-6 py-4 bg-slate-800/50 backdrop-blur-sm border-2 border-slate-600/50 rounded-2xl text-white placeholder:text-slate-400 focus:border-emerald-400/50 focus:bg-slate-700/50 focus:outline-none focus:ring-4 focus:ring-emerald-400/20 transition-all duration-300 font-medium"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        />
                                        <p className="text-xs text-slate-400 font-medium">We'll never share your email with anyone</p>
                                    </motion.div>

                                    {/* Interests Selection */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.7 }}
                                        className="space-y-4"
                                    >
                                        <label className="block text-sm font-semibold font-mono uppercase tracking-wider text-emerald-400">
                                            What interests you most? (Optional)
                                        </label>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            {[
                                                "Personal Chart Reading",
                                                "AI-Powered Insights",
                                                "Real-time Transits",
                                                "Community Features",
                                                "Mobile App",
                                                "Advanced Tools"
                                            ].map((interest) => (
                                                <motion.button
                                                    key={interest}
                                                    type="button"
                                                    onClick={() => handleInterestToggle(interest)}
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    className={`p-4 text-left rounded-xl border-2 backdrop-blur-sm transition-all duration-300 font-medium ${
                                                        formData.interests.includes(interest)
                                                            ? 'bg-emerald-500/20 border-emerald-400/50 text-emerald-300'
                                                            : 'bg-slate-800/30 border-slate-600/50 text-slate-400 hover:border-slate-500/50 hover:text-slate-300'
                                                    }`}
                                                >
                                                    {interest}
                                                </motion.button>
                                            ))}
                                        </div>
                                    </motion.div>

                                    {/* Submit Button */}
                                    <motion.button
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.8 }}
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="group relative w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 bg-size-200 bg-pos-0 hover:bg-pos-100 py-5 rounded-2xl font-semibold text-white shadow-2xl shadow-emerald-500/25 hover:shadow-3xl hover:shadow-emerald-500/40 hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                                        style={{ backgroundSize: "200% 100%" }}
                                    >
                                        <span className="relative z-10 flex items-center justify-center gap-3 font-mono text-sm uppercase tracking-widest">
                                            {isSubmitting ? (
                                                <>
                                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                    Joining the Cosmos...
                                                </>
                                            ) : (
                                                <>
                                                    <span>Secure My Spot</span>
                                                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                                    </svg>
                                                </>
                                            )}
                                        </span>
                                    </motion.button>

                                    {/* Benefits List */}
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.9 }}
                                        className="text-center space-y-3 pt-4"
                                    >
                                        <p className="text-sm text-slate-400 font-medium">By joining, you'll get:</p>
                                        <div className="flex flex-wrap justify-center gap-2 text-xs text-slate-300">
                                            {["Early Access", "Exclusive Updates", "Beta Features", "Community Access"].map((benefit, index) => (
                                                <span key={benefit} className="px-3 py-1 bg-slate-700/30 rounded-full">
                                                    ✓ {benefit}
                                                </span>
                                            ))}
                                        </div>
                                    </motion.div>
                                </form>
                            </motion.div>
                        )}

                        {/* Success State */}
                        {step === "success" && (
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="flex flex-col items-center justify-center py-16 space-y-8 text-center"
                            >
                                {/* Success Animation */}
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                                    className="relative"
                                >
                                    <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-cyan-400 rounded-full flex items-center justify-center shadow-2xl shadow-emerald-400/30">
                                        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <motion.div
                                        animate={{
                                            scale: [1, 1.2, 1],
                                            opacity: [0.5, 1, 0.5]
                                        }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                        className="absolute inset-0 bg-emerald-400/30 rounded-full blur-xl"
                                    />
                                </motion.div>

                                <div className="space-y-4">
                                    <h3 className="font-serif text-3xl font-bold bg-gradient-to-r from-white to-emerald-200 bg-clip-text text-transparent">
                                        Welcome to the Cosmic Revolution!
                                    </h3>
                                    <p className="text-slate-300 max-w-md leading-relaxed">
                                        Thank you, <span className="text-emerald-400 font-semibold">{formData.name}</span>!
                                        You're now on the exclusive waitlist for Veas. We'll notify you the moment we launch.
                                    </p>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
                                    <motion.button
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.6 }}
                                        onClick={handleReset}
                                        className="flex-1 px-6 py-4 bg-slate-700/50 backdrop-blur-sm border border-slate-600/50 rounded-xl font-mono text-sm font-semibold uppercase tracking-wider text-slate-300 hover:bg-slate-600/50 hover:text-white hover:scale-[1.02] transition-all duration-200"
                                    >
                                        Add Another
                                    </motion.button>
                                    <motion.button
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.7 }}
                                        onClick={onClose}
                                        className="flex-1 px-6 py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-xl font-mono text-sm font-semibold uppercase tracking-wider text-white hover:from-emerald-600 hover:to-cyan-600 hover:scale-[1.02] transition-all duration-200 shadow-lg shadow-emerald-500/30"
                                    >
                                        Explore More
                                    </motion.button>
                                </div>

                                {/* Social Share */}
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.8 }}
                                    className="pt-8 border-t border-slate-700/50 w-full max-w-md"
                                >
                                    <p className="text-sm text-slate-400 mb-4">Share the cosmic revolution:</p>
                                    <div className="flex justify-center gap-4">
                                        {["Twitter", "LinkedIn", "Facebook"].map((platform) => (
                                            <motion.button
                                                key={platform}
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                className="px-4 py-2 bg-slate-700/30 hover:bg-slate-600/50 rounded-lg text-sm text-slate-300 hover:text-white transition-all duration-200"
                                            >
                                                {platform}
                                            </motion.button>
                                        ))}
                                    </div>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </motion.div>
    );
}
