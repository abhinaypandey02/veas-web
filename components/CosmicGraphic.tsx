"use client";

import { motion } from "framer-motion";
import { useState } from "react";

// Generate particles only on client side to avoid hydration mismatch
const generateParticles = () =>
  [...Array(20)].map((_, i) => ({
    id: i,
    width: Math.random() * 2 + 1,
    height: Math.random() * 2 + 1,
    top: Math.random() * 100,
    left: Math.random() * 100,
    duration: Math.random() * 3 + 2,
    delay: Math.random() * 5,
  }));

export const CosmicGraphic = () => {
  const [particles] = useState<ReturnType<typeof generateParticles>>(() =>
    generateParticles(),
  );

  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none">
      {/* Central Orbit Rings */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-30">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
          className="w-full h-full rounded-full border border-cosmic-purple/20 relative"
        >
          <div className="absolute top-0 left-1/2 w-2 h-2 bg-cosmic-purple rounded-full -translate-x-1/2 -translate-y-1" />
        </motion.div>
      </div>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] opacity-40">
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
          className="w-full h-full rounded-full border border-cosmic-lavender/40"
        />
      </div>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] opacity-50">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          className="w-full h-full rounded-full border border-dashed border-cosmic-purple/30"
        />
      </div>

      {/* Floating Particles/Stars */}
      <div className="absolute inset-0">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute bg-cosmic-purple rounded-full opacity-40"
            style={{
              width: particle.width,
              height: particle.height,
              top: `${particle.top}%`,
              left: `${particle.left}%`,
            }}
            animate={{
              opacity: [0.2, 0.6, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
            }}
          />
        ))}
      </div>
    </div>
  );
};
