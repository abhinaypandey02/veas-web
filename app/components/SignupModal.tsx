"use client";

import { useState, useEffect } from "react";
import { calculateChart, type BirthData, type VedicChart } from "../utils/vedicCalculations";
import { motion, AnimatePresence } from "framer-motion";

interface SignupModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function SignupModal({ isOpen, onClose }: SignupModalProps) {
    const [step, setStep] = useState<"birth-data" | "calculating" | "results">("birth-data");
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        birthDate: "",
        birthTime: "",
        birthLocation: "",
        timezoneOffset: new Date().getTimezoneOffset(),
    });
    const [vedicChart, setVedicChart] = useState<VedicChart | null>(null);
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setStep("calculating");

        try {
            const birthData: BirthData = {
                name: formData.name,
                email: formData.email,
                date: formData.birthDate,
                time: formData.birthTime,
                location: formData.birthLocation,
                timezoneOffset: formData.timezoneOffset,
            };

            // Calculate Vedic chart via API
            const chart = await calculateChart(birthData);
            setVedicChart(chart);
            setStep("results");
        } catch (err) {
            console.error("Calculation error:", err);
            setError("An error occurred while calculating your chart. Please check your location and try again.");
            setStep("birth-data");
        }
    };

    const handleReset = () => {
        setStep("birth-data");
        setFormData({
            name: "",
            email: "",
            birthDate: "",
            birthTime: "",
            birthLocation: "",
            timezoneOffset: new Date().getTimezoneOffset(),
        });
        setVedicChart(null);
        setError("");
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
            {/* Enhanced Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-gradient-to-br from-slate-900/60 via-purple-900/40 to-indigo-900/60 backdrop-blur-lg"
                onClick={onClose}
            />

            {/* Modal Card */}
            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                transition={{ type: "spring", duration: 0.5 }}
                className="relative w-full max-w-4xl max-h-[95vh] overflow-hidden bg-gradient-to-br from-[#FDFBF7] via-white to-indigo-50/30 shadow-2xl"
                style={{ borderRadius: "32px" }}
            >
                {/* Decorative Background Elements */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ borderRadius: "32px" }}>
                    <div className="absolute -top-24 -right-24 w-96 h-96 bg-gradient-to-br from-indigo-200/30 to-purple-200/30 rounded-full blur-3xl" />
                    <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-gradient-to-tr from-amber-200/20 to-rose-200/20 rounded-full blur-3xl" />
                </div>

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute right-6 top-6 z-50 p-2.5 rounded-full bg-white/80 backdrop-blur-sm border border-slate-200/50 text-slate-600 hover:text-slate-900 hover:bg-white hover:scale-110 transition-all duration-200 shadow-lg"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>

                {/* Content Container with Scroll */}
                <div className="relative max-h-[95vh] overflow-y-auto p-8 sm:p-12">
                    <AnimatePresence mode="wait">
                        {/* Birth Data Form */}
                        {step === "birth-data" && (
                            <motion.div
                                key="form"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="space-y-8"
                            >
                                <div className="text-center space-y-3">
                                    <h2 className="font-serif text-4xl sm:text-5xl font-bold bg-gradient-to-r from-slate-900 via-indigo-900 to-purple-900 bg-clip-text text-transparent leading-tight">
                                        Discover Your True Chart
                                    </h2>
                                    <p className="font-sans text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
                                        Enter your birth details to unlock your authentic Sidereal chart—aligned with the actual sky, not outdated calculations. We'll automatically detect your timezone.
                                    </p>
                                </div>

                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="p-5 bg-gradient-to-r from-red-50 to-rose-50 border-l-4 border-red-500 rounded-xl"
                                    >
                                        <div className="flex items-start gap-3">
                                            <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                            </svg>
                                            <p className="text-sm font-medium text-red-800">{error}</p>
                                        </div>
                                    </motion.div>
                                )}

                                <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div className="space-y-2.5">
                                            <label htmlFor="name" className="block text-sm font-semibold font-mono uppercase tracking-wider text-slate-700">
                                                Name
                                            </label>
                                            <input
                                                type="text"
                                                id="name"
                                                required
                                                placeholder="Your full name"
                                                className="w-full px-5 py-4 bg-white/70 backdrop-blur border-2 border-slate-200 rounded-2xl text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-100 transition-all duration-200 font-medium"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            />
                                        </div>

                                        <div className="space-y-2.5">
                                            <label htmlFor="email" className="block text-sm font-semibold font-mono uppercase tracking-wider text-slate-700">
                                                Email
                                            </label>
                                            <input
                                                type="email"
                                                id="email"
                                                required
                                                placeholder="name@example.com"
                                                className="w-full px-5 py-4 bg-white/70 backdrop-blur border-2 border-slate-200 rounded-2xl text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-100 transition-all duration-200 font-medium"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div className="space-y-2.5">
                                            <label htmlFor="birthDate" className="block text-sm font-semibold font-mono uppercase tracking-wider text-slate-700">
                                                Birth Date
                                            </label>
                                            <input
                                                type="date"
                                                id="birthDate"
                                                required
                                                className="w-full px-5 py-4 bg-white/70 backdrop-blur border-2 border-slate-200 rounded-2xl text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-100 transition-all duration-200 font-medium"
                                                value={formData.birthDate}
                                                onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                                            />
                                        </div>

                                        <div className="space-y-2.5">
                                            <label htmlFor="birthTime" className="block text-sm font-semibold font-mono uppercase tracking-wider text-slate-700">
                                                Birth Time
                                            </label>
                                            <input
                                                type="time"
                                                id="birthTime"
                                                required
                                                className="w-full px-5 py-4 bg-white/70 backdrop-blur border-2 border-slate-200 rounded-2xl text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-100 transition-all duration-200 font-medium"
                                                value={formData.birthTime}
                                                onChange={(e) => setFormData({ ...formData, birthTime: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2.5">
                                        <label htmlFor="birthLocation" className="block text-sm font-semibold font-mono uppercase tracking-wider text-slate-700">
                                            Birth Location
                                        </label>
                                        <input
                                            type="text"
                                            id="birthLocation"
                                            required
                                            placeholder="e.g., Mumbai, India or New York, USA"
                                            className="w-full px-5 py-4 bg-white/70 backdrop-blur border-2 border-slate-200 rounded-2xl text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-100 transition-all duration-200 font-medium"
                                            value={formData.birthLocation}
                                            onChange={(e) => setFormData({ ...formData, birthLocation: e.target.value })}
                                        />
                                        <p className="mt-2 text-xs text-slate-500 font-medium">City, Country or City, State, Country</p>
                                    </div>

                                    <button
                                        type="submit"
                                        className="group relative w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-size-200 bg-pos-0 hover:bg-pos-100 py-5 rounded-2xl font-mono text-sm font-bold uppercase tracking-widest text-white shadow-xl shadow-indigo-500/30 hover:shadow-2xl hover:shadow-indigo-500/40 hover:scale-[1.02] transition-all duration-300"
                                        style={{ backgroundSize: "200% 100%" }}
                                    >
                                        <span className="relative z-10 flex items-center justify-center gap-3">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                            </svg>
                                            Calculate My True Chart
                                        </span>
                                    </button>
                                </form>
                            </motion.div>
                        )}

                        {/* Calculating State */}
                        {step === "calculating" && (
                            <motion.div
                                key="calculating"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="flex flex-col items-center justify-center py-24 space-y-8"
                            >
                                <div className="relative">
                                    <div className="w-24 h-24 border-[6px] border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <svg className="w-8 h-8 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="text-center space-y-3">
                                    <h3 className="font-serif text-3xl font-bold text-slate-900">Aligning with the cosmos...</h3>
                                    <p className="font-sans text-base text-slate-600 max-w-md">
                                        Calculating planetary positions based on the actual sky
                                    </p>
                                </div>
                            </motion.div>
                        )}

                        {/* Results Display */}
                        {step === "results" && vedicChart && (
                            <motion.div
                                key="results"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="space-y-10"
                            >
                                <div className="text-center space-y-4">
                                    <motion.h2
                                        initial={{ scale: 0.9, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ delay: 0.1 }}
                                        className="font-serif text-4xl sm:text-5xl font-bold bg-gradient-to-r from-slate-900 via-indigo-900 to-purple-900 bg-clip-text text-transparent"
                                    >
                                        {formData.name}'s True Chart
                                    </motion.h2>
                                    <p className="font-sans text-base text-slate-600">
                                        Actual sky positions (Sidereal)
                                    </p>
                                </div>

                                {/* Ayanamsa Info */}
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="p-6 bg-gradient-to-r from-indigo-50 via-purple-50 to-indigo-50 border-2 border-indigo-200/50 rounded-3xl shadow-lg"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 bg-indigo-600 rounded-2xl">
                                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                            </svg>
                                        </div>
                                        <div className="flex-1">
                                            <span className="font-mono text-xs font-bold uppercase tracking-wider text-indigo-900 block mb-2">Precession Offset</span>
                                            <p className="text-base text-indigo-800 font-medium leading-relaxed">
                                                The stars have shifted <strong className="font-bold text-indigo-900">{vedicChart.ayanamsa.toFixed(2)}°</strong> since Western astrology was created. This is why your true sign may differ.
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Sun Sign Comparison - Enhanced */}
                                <div className="space-y-5">
                                    <h3 className="font-mono text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                                        <span className="text-2xl">☉</span> Sun Sign
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        {/* Tropical (Western) - Grayed */}
                                        <motion.div
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.3 }}
                                            className="relative p-8 bg-gradient-to-br from-slate-100 to-slate-200 border-2 border-slate-300 rounded-3xl overflow-hidden"
                                        >
                                            <div className="absolute top-4 right-4 text-6xl text-slate-300 opacity-50">✕</div>
                                            <div className="relative space-y-4">
                                                <span className="inline-block px-3 py-1.5 bg-slate-300 text-slate-600 rounded-full font-mono text-[10px] font-bold uppercase tracking-wider">
                                                    Tropical (Western)
                                                </span>
                                                <div className="flex items-center gap-4">
                                                    <span className="text-6xl opacity-60">{vedicChart.sunSign.symbol}</span>
                                                    <div>
                                                        <span className="font-serif text-3xl text-slate-500 line-through block">{vedicChart.sunSign.tropical}</span>
                                                        <p className="text-sm text-slate-500 italic mt-1">The illusion you've been told</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>

                                        {/* Sidereal (True) - Highlighted */}
                                        <motion.div
                                            initial={{ opacity: 0, x: 10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.4 }}
                                            className="relative p-8 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 border-2 border-white/50 rounded-3xl shadow-2xl overflow-hidden"
                                        >
                                            <div className="absolute top-4 right-4 text-6xl text-white/30">✓</div>
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
                                            <div className="relative space-y-4">
                                                <span className="inline-block px-3 py-1.5 bg-white/30 backdrop-blur-sm text-white rounded-full font-mono text-[10px] font-bold uppercase tracking-wider">
                                                    Sidereal (True)
                                                </span>
                                                <div className="flex items-center gap-4">
                                                    <span className="text-6xl drop-shadow-lg">{vedicChart.sunSign.symbol}</span>
                                                    <div>
                                                        <span className="font-serif text-3xl text-white font-bold block drop-shadow-md">{vedicChart.sunSign.sidereal}</span>
                                                        <p className="text-sm text-white/90 font-semibold mt-1">Your cosmic signature</p>
                                                        <p className="text-xs text-white/80 font-mono mt-1">{vedicChart.sunSign.degree.toFixed(2)}°</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    </div>
                                </div>

                                {/* Moon & Ascendant - Enhanced Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Moon Sign */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.5 }}
                                        className="p-8 bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 border-2 border-purple-200/50 rounded-3xl shadow-lg"
                                    >
                                        <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-purple-700 mb-4 flex items-center gap-2">
                                            <span className="text-xl">☽</span> Moon Sign
                                        </h4>
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-3">
                                                <span className="text-5xl">{vedicChart.moonSign.symbol}</span>
                                                <div>
                                                    <span className="font-serif text-2xl text-purple-900 font-bold block">{vedicChart.moonSign.sidereal}</span>
                                                    <p className="text-xs text-purple-700 font-mono">{vedicChart.moonSign.degree.toFixed(2)}°</p>
                                                </div>
                                            </div>
                                            <div className="pt-3 border-t-2 border-purple-200">
                                                <span className="text-xs font-mono font-bold uppercase tracking-wider text-purple-600 block mb-1.5">Lunar Mansion</span>
                                                <span className="font-serif text-xl text-purple-900 font-semibold block">{vedicChart.moonSign.nakshatra}</span>
                                                <p className="text-sm text-purple-700 mt-2 italic">Your emotional core</p>
                                            </div>
                                        </div>
                                    </motion.div>

                                    {/* Ascendant */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.6 }}
                                        className="p-8 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 border-2 border-amber-200/50 rounded-3xl shadow-lg"
                                    >
                                        <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-amber-700 mb-4 flex items-center gap-2">
                                            <span className="text-xl">↑</span> Rising Sign
                                        </h4>
                                        <div className="flex items-center gap-3">
                                            <span className="text-5xl">{vedicChart.ascendant.symbol}</span>
                                            <div>
                                                <span className="font-serif text-2xl text-amber-900 font-bold block">{vedicChart.ascendant.sign}</span>
                                                <p className="text-xs text-amber-700 font-mono">{vedicChart.ascendant.degree.toFixed(2)}°</p>
                                                <p className="text-sm text-amber-800 mt-2 italic">How the world sees you</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                </div>

                                {/* Action Buttons */}
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.7 }}
                                    className="flex flex-col sm:flex-row gap-4 pt-6"
                                >
                                    <button
                                        onClick={handleReset}
                                        className="flex-1 px-8 py-4 bg-white border-2 border-slate-300 rounded-2xl font-mono text-sm font-bold uppercase tracking-wider text-slate-700 hover:bg-slate-50 hover:border-slate-400 hover:scale-[1.02] transition-all duration-200 shadow-lg"
                                    >
                                        Calculate Another
                                    </button>
                                    <button
                                        onClick={onClose}
                                        className="flex-1 px-8 py-4 bg-gradient-to-r from-slate-900 to-indigo-900 rounded-2xl font-mono text-sm font-bold uppercase tracking-wider text-white hover:from-slate-800 hover:to-indigo-800 hover:scale-[1.02] transition-all duration-200 shadow-xl shadow-slate-900/30"
                                    >
                                        Explore More
                                    </button>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </motion.div>
    );
}
