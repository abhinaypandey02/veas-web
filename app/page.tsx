"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import LandingNavbar from "./_components/landing-navbar";
import SmoothScroll from "./_components/smooth-scroll";

// Live Timer Component for Hero
function LiveTimer() {
  const [time, setTime] = useState({
    hours: "00",
    minutes: "00",
    seconds: "00",
  });

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime({
        hours: now.getHours().toString().padStart(2, "0"),
        minutes: now.getMinutes().toString().padStart(2, "0"),
        seconds: now.getSeconds().toString().padStart(2, "0"),
      });
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="font-mono text-lg sm:text-xl tracking-wider text-white tabular-nums">
      {time.hours}:{time.minutes}:
      <span className="text-cosmic-lavender">{time.seconds}</span>
    </div>
  );
}

// Constellation nodes data
const constellationNodes = [
  { id: 1, x: 5, y: 10 },
  { id: 2, x: 12, y: 15 },
  { id: 3, x: 8, y: 25 },
  { id: 4, x: 18, y: 8 },
  { id: 5, x: 25, y: 20 },
  { id: 6, x: 15, y: 35 },
  { id: 7, x: 30, y: 12 },
  { id: 8, x: 35, y: 28 },
  { id: 9, x: 22, y: 40 },
  { id: 10, x: 45, y: 15 },
  { id: 11, x: 50, y: 5 },
  { id: 12, x: 55, y: 22 },
  { id: 13, x: 42, y: 35 },
  { id: 14, x: 60, y: 10 },
  { id: 15, x: 65, y: 30 },
  { id: 16, x: 70, y: 18 },
  { id: 17, x: 75, y: 8 },
  { id: 18, x: 80, y: 25 },
  { id: 19, x: 85, y: 12 },
  { id: 20, x: 90, y: 22 },
  { id: 21, x: 95, y: 15 },
  { id: 22, x: 10, y: 50 },
  { id: 23, x: 20, y: 55 },
  { id: 24, x: 5, y: 65 },
  { id: 25, x: 25, y: 70 },
  { id: 26, x: 35, y: 55 },
  { id: 27, x: 40, y: 68 },
  { id: 28, x: 50, y: 60 },
  { id: 29, x: 55, y: 75 },
  { id: 30, x: 65, y: 55 },
  { id: 31, x: 70, y: 70 },
  { id: 32, x: 78, y: 58 },
  { id: 33, x: 85, y: 65 },
  { id: 34, x: 92, y: 55 },
  { id: 35, x: 8, y: 80 },
  { id: 36, x: 18, y: 88 },
  { id: 37, x: 28, y: 82 },
  { id: 38, x: 38, y: 90 },
  { id: 39, x: 48, y: 85 },
  { id: 40, x: 58, y: 92 },
  { id: 41, x: 68, y: 85 },
  { id: 42, x: 78, y: 90 },
  { id: 43, x: 88, y: 82 },
  { id: 44, x: 95, y: 88 },
];

// Pre-generated twinkling stars (to avoid Math.random during render)
const twinklingStars = [
  { cx: 15, cy: 8, duration: 3.2, delay: 0.5 },
  { cx: 82, cy: 12, duration: 4.1, delay: 1.2 },
  { cx: 45, cy: 22, duration: 2.8, delay: 2.8 },
  { cx: 68, cy: 38, duration: 3.5, delay: 0.3 },
  { cx: 23, cy: 45, duration: 4.8, delay: 3.1 },
  { cx: 91, cy: 28, duration: 2.5, delay: 1.8 },
  { cx: 37, cy: 62, duration: 3.9, delay: 4.2 },
  { cx: 76, cy: 48, duration: 4.3, delay: 0.9 },
  { cx: 12, cy: 72, duration: 2.9, delay: 2.1 },
  { cx: 58, cy: 85, duration: 3.7, delay: 3.8 },
  { cx: 84, cy: 75, duration: 4.6, delay: 1.5 },
  { cx: 29, cy: 92, duration: 2.6, delay: 4.7 },
  { cx: 47, cy: 18, duration: 3.3, delay: 0.7 },
  { cx: 93, cy: 52, duration: 4.2, delay: 2.4 },
  { cx: 6, cy: 35, duration: 2.7, delay: 3.5 },
  { cx: 62, cy: 68, duration: 3.8, delay: 1.1 },
  { cx: 18, cy: 58, duration: 4.4, delay: 4.0 },
  { cx: 71, cy: 92, duration: 2.4, delay: 0.2 },
  { cx: 39, cy: 78, duration: 3.6, delay: 2.6 },
  { cx: 88, cy: 42, duration: 4.0, delay: 3.3 },
  { cx: 52, cy: 32, duration: 2.3, delay: 1.7 },
  { cx: 8, cy: 88, duration: 3.4, delay: 4.4 },
  { cx: 65, cy: 15, duration: 4.5, delay: 0.6 },
  { cx: 34, cy: 42, duration: 2.2, delay: 2.9 },
  { cx: 79, cy: 65, duration: 3.1, delay: 3.9 },
  { cx: 21, cy: 28, duration: 4.7, delay: 1.4 },
  { cx: 56, cy: 52, duration: 2.1, delay: 4.1 },
  { cx: 95, cy: 85, duration: 3.0, delay: 0.8 },
  { cx: 43, cy: 95, duration: 4.9, delay: 2.2 },
  { cx: 3, cy: 48, duration: 2.0, delay: 3.6 },
];

// Pre-defined connections that will animate
const constellationConnections = [
  [1, 2],
  [2, 3],
  [2, 4],
  [4, 5],
  [5, 6],
  [3, 6],
  [4, 7],
  [7, 8],
  [8, 9],
  [5, 8],
  [6, 9],
  [7, 10],
  [10, 11],
  [10, 12],
  [11, 14],
  [12, 13],
  [12, 15],
  [14, 16],
  [16, 17],
  [16, 18],
  [17, 19],
  [18, 20],
  [19, 20],
  [20, 21],
  [22, 23],
  [22, 24],
  [23, 25],
  [24, 25],
  [23, 26],
  [26, 27],
  [25, 27],
  [26, 28],
  [28, 29],
  [28, 30],
  [29, 31],
  [30, 31],
  [30, 32],
  [32, 33],
  [33, 34],
  [35, 36],
  [36, 37],
  [37, 38],
  [38, 39],
  [39, 40],
  [40, 41],
  [41, 42],
  [42, 43],
  [43, 44],
  [3, 22],
  [6, 23],
  [9, 25],
  [13, 27],
  [15, 30],
  [18, 32],
  [21, 34],
  [24, 35],
  [25, 37],
  [27, 38],
  [29, 39],
  [31, 41],
  [33, 43],
];

function ConstellationField() {
  return (
    <div className="absolute inset-0 z-[1] pointer-events-none overflow-hidden">
      <svg
        className="w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Animated connection lines */}
        {constellationConnections.map(([from, to], index) => {
          const fromNode = constellationNodes.find((n) => n.id === from);
          const toNode = constellationNodes.find((n) => n.id === to);
          if (!fromNode || !toNode) return null;

          return (
            <motion.line
              key={`line-${index}`}
              x1={fromNode.x}
              y1={fromNode.y}
              x2={toNode.x}
              y2={toNode.y}
              stroke="currentColor"
              className="text-white"
              strokeWidth="0.08"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{
                pathLength: [0, 1, 1, 0],
                opacity: [0, 0.4, 0.4, 0],
              }}
              transition={{
                duration: 8,
                delay: (index % 15) * 0.5,
                repeat: Infinity,
                repeatDelay: 2,
                ease: "easeInOut",
              }}
            />
          );
        })}

        {/* Star nodes */}
        {constellationNodes.map((node, index) => (
          <motion.circle
            key={`node-${node.id}`}
            cx={node.x}
            cy={node.y}
            r="0.4"
            fill="currentColor"
            className="text-white"
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: [0, 1.2, 1, 1.2, 0],
              opacity: [0, 0.8, 0.6, 0.8, 0],
            }}
            transition={{
              duration: 6,
              delay: (index % 20) * 0.3,
              repeat: Infinity,
              repeatDelay: 3,
              ease: "easeInOut",
            }}
          />
        ))}

        {/* Extra twinkling stars */}
        {twinklingStars.map((star, i) => (
          <motion.circle
            key={`twinkle-${i}`}
            cx={star.cx}
            cy={star.cy}
            r="0.15"
            fill="currentColor"
            className="text-white"
            animate={{
              opacity: [0, 0.7, 0],
              scale: [0.5, 1.5, 0.5],
            }}
            transition={{
              duration: star.duration,
              delay: star.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </svg>
    </div>
  );
}

const pricingPlans = [
  {
    name: "Explorer",
    icon: "☆",
    description: "Start with your true chart",
    price: { monthly: "Free", yearly: "Free" },
    isPopular: false,
    features: [
      "Sidereal birth chart",
      "Sun, Moon & Rising signs",
      "Core planetary placements",
      "Shareable chart",
    ],
  },
  {
    name: "Seeker",
    icon: "★",
    description: "Go deeper into the patterns",
    price: { monthly: "$12", yearly: "$99" },
    isPopular: true,
    features: [
      "Everything in Explorer",
      "Planetary aspects",
      "Monthly transit reports",
      "Compatibility insights",
      "Priority support",
    ],
  },
  {
    name: "Mystic",
    icon: "✧",
    description: "Full-spectrum self-understanding",
    price: { monthly: "$29", yearly: "$249" },
    isPopular: false,
    features: [
      "Everything in Seeker",
      "Unlimited chart readings",
      "AI-powered interpretations",
      "Academy access",
      "1-on-1 consultation each month",
    ],
  },
];

const courses = [
  {
    title: "Understanding Your True Sign",
    description:
      "Discover why your sign might not be what you think. An introduction to sidereal alignments.",
    price: "$49",
    tags: ["Beginner", "Foundations"],
  },
  {
    title: "Planetary Transits 2024",
    description:
      "Navigate the year ahead with precision. Understand how planetary movements affect your chart.",
    price: "$89",
    tags: ["Intermediate", "Forecast"],
  },
  {
    title: "The Moon & Emotions",
    description:
      "Deep dive into your emotional landscape through the lens of the moon's actual position.",
    price: "$59",
    tags: ["Wellness", "Psychology"],
  },
];

function PricingSection() {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">(
    "monthly",
  );

  return (
    <>
      <LandingNavbar />
      <section className="py-24 px-24 border-t border-foreground/10">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cosmic-purple/30 bg-white/60 backdrop-blur-sm mb-6"
          >
            <span className="text-[11px] uppercase tracking-[0.2em] text-muted">
              Pricing
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="font-editorial text-4xl sm:text-5xl lg:text-6xl mb-4 text-foreground"
          >
            Simple, <span className="italic">Flexible</span> Pricing
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-muted max-w-md mx-auto mb-8"
          >
            Astrology for every stage of your journey.
          </motion.p>

          {/* Billing Toggle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
            className="inline-flex items-center p-1 rounded-full bg-white border border-foreground/10"
          >
            <button
              onClick={() => setBillingPeriod("monthly")}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                billingPeriod === "monthly"
                  ? "bg-foreground text-white"
                  : "text-muted hover:text-foreground"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingPeriod("yearly")}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                billingPeriod === "yearly"
                  ? "bg-foreground text-white"
                  : "text-muted hover:text-foreground"
              }`}
            >
              Yearly
            </button>
          </motion.div>
          {billingPeriod === "yearly" && (
            <p className="text-xs text-cosmic-cobalt mt-2">
              Save up to 30% with yearly billing
            </p>
          )}
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {pricingPlans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * i }}
              viewport={{ once: true }}
              className={`relative p-8 rounded-2xl ${
                plan.isPopular
                  ? "bg-gradient-to-br from-cosmic-lavender/20 to-cosmic-purple/10 border-2 border-cosmic-purple/30"
                  : "bg-white border border-foreground/10"
              }`}
            >
              {/* Popular Badge */}
              {plan.isPopular && (
                <div className="absolute -top-3 left-8">
                  <span className="px-3 py-1 rounded-full bg-foreground text-white text-[10px] uppercase tracking-widest">
                    Popular
                  </span>
                </div>
              )}

              {/* Icon & Name */}
              <div className="flex items-center gap-3 mb-2">
                <span
                  className={`text-2xl ${plan.isPopular ? "text-cosmic-purple" : "text-cosmic-cobalt"}`}
                >
                  {plan.icon}
                </span>
                <h3 className="text-xl font-medium text-foreground">
                  {plan.name}
                </h3>
              </div>

              <p className="text-sm text-muted mb-6">{plan.description}</p>

              {/* Price */}
              <div className="mb-6">
                <span className="text-4xl font-serif text-foreground">
                  {plan.price[billingPeriod]}
                </span>
                {plan.price[billingPeriod] !== "Free" && (
                  <span className="text-sm text-muted ml-1">
                    /{billingPeriod === "monthly" ? "month" : "year"}
                  </span>
                )}
              </div>

              {/* CTA Button */}
              <button
                className={`w-full h-12 rounded-full font-medium text-sm uppercase tracking-wide transition-colors mb-8 ${
                  plan.isPopular
                    ? "bg-foreground text-white hover:bg-cosmic-cobalt"
                    : "border border-foreground/20 text-foreground hover:bg-foreground/5"
                }`}
              >
                Get Started
              </button>

              {/* Features */}
              <div>
                <p className="text-xs uppercase tracking-widest text-muted mb-4">
                  What&apos;s Included
                </p>
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <span
                        className={`text-sm ${plan.isPopular ? "text-cosmic-purple" : "text-cosmic-cobalt"}`}
                      >
                        ✦
                      </span>
                      <span className="text-sm text-foreground/80">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </>
  );
}

const testimonials = [
  {
    quote:
      "The shift from Western to Sidereal made everything click. It felt like coming home to my true self.",
    name: "Elena R.",
    title: "Architect",
    avatar: "E",
  },
  {
    quote:
      "I was skeptical at first, but the accuracy of my Sidereal chart blew my mind. Finally, astrology aligned with actual astronomy.",
    name: "Marcus T.",
    title: "Software Engineer",
    avatar: "M",
  },
  {
    quote:
      "Understanding the real planetary positions finally made my emotional patterns make sense.",
    name: "Priya S.",
    title: "Entrepreneur",
    avatar: "P",
  },
  {
    quote:
      "Past transits suddenly clicked. Veas brings ancient wisdom into a modern, grounded experience.",
    name: "James W.",
    title: "Astrology Teacher",
    avatar: "J",
  },
];

function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length,
    );
  };

  return (
    <section className="relative z-10 py-24 sm:py-32 bg-background">
      {/* Curved Container with Background Image */}
      <div className="mx-4 sm:mx-8 lg:mx-12 rounded-[3rem] sm:rounded-[4rem] overflow-hidden relative">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/reviewsbg.png')" }}
        />

        <div className="relative z-10 px-6 sm:px-12 lg:px-20 py-20 sm:py-28">
          {/* Header */}
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white bg-transparent backdrop-blur-sm mb-6"
            >
              <span className="text-[11px] uppercase tracking-[0.2em] text-white">
                Wall of Love
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="font-editorial text-4xl sm:text-5xl lg:text-6xl text-white"
            >
              What they&apos;re <span className="italic">Saying</span>
            </motion.h2>
          </div>

          {/* Testimonial Card with Navigation */}
          <div className="flex items-center justify-center gap-4 sm:gap-8 max-w-4xl mx-auto">
            {/* Prev Button */}
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              onClick={prevTestimonial}
              className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-transparent backdrop-blur-sm border border-white flex items-center justify-center hover:bg-white transition-colors shadow-lg"
            >
              <span className="text-white text-lg">‹</span>
            </motion.button>

            {/* Card */}
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="flex-1 bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-8 sm:p-10 shadow-xl max-w-2xl"
            >
              <p className="text-lg sm:text-xl text-foreground leading-relaxed mb-8 font-light">
                &ldquo;{testimonials[currentIndex].quote}&rdquo;
              </p>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cosmic-purple to-cosmic-lavender flex items-center justify-center text-white font-medium">
                  {testimonials[currentIndex].avatar}
                </div>
                <div>
                  <p className="font-medium text-foreground">
                    {testimonials[currentIndex].name}
                  </p>
                  <p className="text-sm text-muted">
                    {testimonials[currentIndex].title}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Next Button */}
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              onClick={nextTestimonial}
              className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-full text-white bg-transparent backdrop-blur-sm border border-white flex items-center justify-center hover:bg-white transition-colors shadow-lg"
            >
              <span className="text-white text-lg">›</span>
            </motion.button>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === currentIndex
                    ? "bg-foreground w-6"
                    : "bg-foreground/30 hover:bg-foreground/50"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

const faqs = [
  {
    question: "What is Sidereal astrology?",
    answer:
      "Sidereal astrology measures planets against the actual constellations in the sky, rather than fixed seasonal points.",
  },
  {
    question: "Why might my sign be different?",
    answer:
      "Because the sky has shifted over time. Tropical astrology doesn’t account for this — Sidereal does.",
  },
  {
    question: "Is Sidereal astrology more accurate?",
    answer:
      "Accuracy depends on alignment. Sidereal charts reflect where the planets truly were, astronomically.",
  },
  {
    question: "How do I get my free chart?",
    answer: "Just enter your birth details — no payment required.",
  },
  {
    question: "Can I cancel anytime?",
    answer: "Yes. No commitments, no friction.",
  },
  {
    question: "What makes Veas different?",
    answer:
      "We align your chart with the real sky using NASA JPL ephemeris data, a precise ayanamsa, and 5,000 years of Jyotish wisdom — translated into clear, grounded language.",
  },
];

function ScrollingTextBanner() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const x = useTransform(scrollYProgress, [0, 1], ["10%", "-50%"]);

  return (
    <section
      ref={containerRef}
      className="relative z-10 py-20 sm:py-28 overflow-hidden bg-surface-highlight"
    >
      <motion.div
        style={{ x }}
        className="whitespace-nowrap flex items-center gap-8"
      >
        <span className="font-editorial text-[8rem] sm:text-[12rem] lg:text-[16rem] text-black leading-none">
          See the sky as it truly was
        </span>
        <span className="text-6xl sm:text-8xl text-cosmic-purple/30">✧</span>
        <span className="font-editorial text-[8rem] sm:text-[12rem] lg:text-[16rem] text-foreground/10 leading-none">
          Astrology aligned with the real heavens
        </span>
        <span className="text-6xl sm:text-8xl text-cosmic-purple/30">✧</span>
        <span className="font-editorial text-[8rem] sm:text-[12rem] lg:text-[16rem] text-foreground/10 leading-none">
          Discover your true chart
        </span>
      </motion.div>
    </section>
  );
}

function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="relative z-10 py-24 sm:py-32 bg-background">
      <div className="max-w-7xl mx-auto px-6 sm:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left Column - Header */}
          <div className="lg:col-span-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cosmic-purple/30 bg-white/60 backdrop-blur-sm mb-6"
            >
              <span className="text-[11px] uppercase tracking-[0.2em] text-muted">
                FAQ
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="font-editorial text-4xl sm:text-5xl text-foreground mb-6"
            >
              Frequently Asked
              <br />
              Questions
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-muted mb-8"
            >
              Still have a question?
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <Link href="/contact">
                <button className="h-12 px-8 rounded-full border border-foreground/20 text-foreground hover:bg-foreground hover:text-background transition-colors tracking-wide text-sm">
                  Contact Us
                </button>
              </Link>
            </motion.div>
          </div>

          {/* Right Column - FAQ Items */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-3xl border border-foreground/10 overflow-hidden">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.05 * index }}
                  viewport={{ once: true }}
                  className={`${index !== faqs.length - 1 ? "border-b border-foreground/10" : ""}`}
                >
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full px-8 py-6 flex items-center justify-between text-left hover:bg-surface-highlight/50 transition-colors"
                  >
                    <span className="font-medium text-foreground pr-4">
                      {faq.question}
                    </span>
                    <span
                      className={`text-2xl text-muted transition-transform duration-300 ${openIndex === index ? "rotate-45" : ""}`}
                    >
                      +
                    </span>
                  </button>

                  <motion.div
                    initial={false}
                    animate={{
                      height: openIndex === index ? "auto" : 0,
                      opacity: openIndex === index ? 1 : 0,
                    }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <p className="px-8 pb-6 text-muted leading-relaxed">
                      {faq.answer}
                    </p>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <SmoothScroll>
      <div className="relative font-sans selection:bg-cosmic-lavender selection:text-foreground">
        {/* Hero Section - Fixed Background */}
        <section className="fixed inset-0 flex items-center justify-center overflow-hidden bg-background p-2 sm:p-4 lg:p-6">
          {/* Rounded Background Container */}
          <div className="absolute inset-2 sm:inset-4 lg:inset-6 rounded-[1.25rem] sm:rounded-[1.5rem] lg:rounded-[2rem] overflow-hidden shadow-2xl">
            {/* Background Image */}
            <img
              src="/landingsectionbg.png"
              alt="Background"
              className="object-cover w-full h-full"
            />
          </div>

          {/* Animated Floating Constellations - inside the rounded area */}
          <div className="absolute inset-2 sm:inset-4 lg:inset-6 rounded-[1.25rem] sm:rounded-[1.5rem] lg:rounded-[2rem] overflow-hidden">
            <ConstellationField />
          </div>

          {/* Content */}
          <div className="relative z-10 text-center px-6">
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="font-editorial font-medium text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-[1.1] text-white tracking-[-0.04em]"
            >
              See the Sky
              <br />
              <span className="italic">as It Truly Was</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mt-4 text-sm sm:text-base text-white/80 max-w-md mx-auto"
            >
              Sidereal astrology mapped to the real positions of the stars.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8"
            >
              <Link href="/signup">
                <button className="h-12 px-8 rounded-full bg-white text-foreground hover:bg-white/90 transition-colors text-base font-medium">
                  Get Your Free Chart
                </button>
              </Link>
              <Link href="/pricing">
                <button className="h-12 px-8 rounded-full bg-white/10 backdrop-blur-sm border border-white/30 text-white hover:bg-white/20 transition-colors text-base">
                  See Plans
                </button>
              </Link>
            </motion.div>
          </div>

          {/* Bottom Left - Coordinates */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="absolute bottom-12 left-12 sm:bottom-16 sm:left-16 lg:bottom-20 lg:left-20 z-10"
          >
            <div className="flex flex-col gap-1">
              <span className="font-mono text-[10px] sm:text-xs tracking-[0.3em] text-white/70 uppercase">
                Location
              </span>
              <span className="font-mono text-lg sm:text-xl tracking-wider text-white font-medium">
                42°21&apos;N
              </span>
              <span className="font-mono text-lg sm:text-xl tracking-wider text-white font-medium">
                71°03&apos;W
              </span>
            </div>
          </motion.div>

          {/* Bottom Right - Live Cosmic Timer */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="absolute bottom-12 right-12 sm:bottom-16 sm:right-16 lg:bottom-20 lg:right-20 z-10"
          >
            <div className="flex items-center gap-3">
              {/* Saturn SVG Icon */}
              <svg
                className="w-8 h-8 sm:w-10 sm:h-10 text-white"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <circle cx="12" cy="12" r="5" />
                <ellipse
                  cx="12"
                  cy="12"
                  rx="10"
                  ry="3"
                  transform="rotate(-20 12 12)"
                />
              </svg>
              <div className="flex flex-col items-end">
                <span className="font-mono text-[10px] sm:text-xs tracking-[0.3em] text-white/70 uppercase">
                  Cosmic Time
                </span>
                <LiveTimer />
              </div>
            </div>
          </motion.div>
        </section>

        {/* Spacer to push content below the fixed hero */}
        <div className="h-screen" />

        {/* Main Content Wrapper - Scrolls over the hero */}
        <div className="relative z-10 bg-background rounded-t-[3rem] shadow-2xl">
          <main className="mx-auto flex max-w-7xl flex-col px-6 pb-20 sm:px-12">
            {/* Bento Grid Section */}
            <section className="py-24">
              {/* Header */}
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="font-editorial text-4xl sm:text-5xl lg:text-6xl text-foreground mb-12 max-w-md"
              >
                What You&apos;ll Explore
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
                className="text-muted max-w-xl mb-12"
              >
                A modern guide to the real sky: timeless wisdom, precise
                calculations, and clear, grounded language you can use.
              </motion.p>

              {/* Bento Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Large Card - Top Left (spans 2 rows on lg) */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                  className="md:col-span-2 lg:col-span-2 lg:row-span-2 relative rounded-3xl overflow-hidden group cursor-pointer min-h-[400px] lg:min-h-[500px]"
                >
                  {/* Background Image */}
                  <img
                    src="/section1image1.jpg"
                    alt="Lunar Cycles"
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    <span className="inline-block px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs uppercase tracking-wider mb-4">
                      Lunar Cycles
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-serif text-white mb-2">
                      Understand how moon phases
                      <br />
                      shape your emotional rhythm
                    </h3>
                    <p className="text-white/60 text-sm">Emotional alignment</p>
                  </div>
                </motion.div>

                {/* Top Right Card */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  viewport={{ once: true }}
                  className="relative rounded-3xl overflow-hidden group cursor-pointer min-h-[240px]"
                >
                  {/* Background Image */}
                  <img
                    src="/section1image2.jpg"
                    alt="Transits"
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <span className="inline-block px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs uppercase tracking-wider mb-3">
                      Planetary Transits
                    </span>
                    <h3 className="text-xl font-serif text-white mb-2">
                      Navigate major life cycles
                      <br />
                      with awareness and grace
                    </h3>
                    <p className="text-white/60 text-sm">
                      Saturn Return and beyond
                    </p>
                  </div>
                </motion.div>

                {/* Bottom Right Card (next to large card on lg) */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  viewport={{ once: true }}
                  className="relative rounded-3xl overflow-hidden group cursor-pointer min-h-[240px]"
                >
                  {/* Background Image */}
                  <img
                    src="/section1image3.jpg"
                    alt="Birth Chart"
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <span className="inline-block px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs uppercase tracking-wider mb-3">
                      Birth Charts
                    </span>
                    <h3 className="text-xl font-serif text-white mb-2">
                      Decode your Rising sign,
                      <br />
                      planetary placements, and blueprint
                    </h3>
                    <p className="text-white/60 text-sm">Inner architecture</p>
                  </div>
                </motion.div>

                {/* Bottom Row - 3 Cards */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  viewport={{ once: true }}
                  className="relative rounded-3xl overflow-hidden group cursor-pointer min-h-[280px]"
                >
                  {/* Background Image */}
                  <img
                    src="/section1image4.webp"
                    alt="Planets"
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <span className="inline-block px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs uppercase tracking-wider mb-3">
                      Compatibility
                    </span>
                    <h3 className="text-xl font-serif text-white mb-2">
                      Explore relationship dynamics
                      <br />
                      through Synastry and Vedic principles
                    </h3>
                    <p className="text-white/60 text-sm">Connection insights</p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  viewport={{ once: true }}
                  className="relative rounded-3xl overflow-hidden group cursor-pointer min-h-[280px]"
                >
                  {/* Background Image */}
                  <img
                    src="/section1image5.jpg"
                    alt="Compatibility"
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <span className="inline-block px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs uppercase tracking-wider mb-3">
                      Nakshatras
                    </span>
                    <h3 className="text-xl font-serif text-white mb-2">
                      Dive deeper than zodiac signs
                      <br />
                      with the 27 lunar mansions
                    </h3>
                    <p className="text-white/60 text-sm">Lunar wisdom</p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  viewport={{ once: true }}
                  className="relative rounded-3xl overflow-hidden group cursor-pointer min-h-[280px]"
                >
                  {/* Background Image */}
                  <img
                    src="/section1image2.jpg"
                    alt="Nakshatras"
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <span className="inline-block px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs uppercase tracking-wider mb-3">
                      True Chart
                    </span>
                    <h3 className="text-xl font-serif text-white mb-2">
                      See your Sun, Moon & Rising
                      <br />
                      in the real sky
                    </h3>
                    <p className="text-white/60 text-sm">Core alignment</p>
                  </div>
                </motion.div>
              </div>
            </section>

            {/* Feature Grid / Philosophy 
        <section className="py-24 border-t border-foreground/10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-white/70 border border-cosmic-lavender/50 backdrop-blur-sm">
              <div className="w-10 h-10 rounded-full bg-cosmic-lavender/30 flex items-center justify-center mb-6 text-xl text-cosmic-cobalt">
                ✧
              </div>
              <h3 className="font-serif text-2xl mb-4 text-foreground">Precision</h3>
              <p className="text-muted font-light leading-relaxed">
                We use NASA data to calculate the exact position of celestial bodies. No approximations, strictly the sky as it is.
              </p>
            </div>
            <div className="p-8 rounded-2xl bg-white/70 border border-cosmic-lavender/50 backdrop-blur-sm">
              <div className="w-10 h-10 rounded-full bg-cosmic-lavender/30 flex items-center justify-center mb-6 text-xl text-cosmic-cobalt">
                ☾
              </div>
              <h3 className="font-serif text-2xl mb-4 text-foreground">Clarity</h3>
              <p className="text-muted font-light leading-relaxed">
                Astrology shouldn't be confusing. We strip away the mysticism to reveal the clean, geometric logic of the cosmos.
              </p>
            </div>
            <div className="p-8 rounded-2xl bg-white/70 border border-cosmic-lavender/50 backdrop-blur-sm">
              <div className="w-10 h-10 rounded-full bg-cosmic-lavender/30 flex items-center justify-center mb-6 text-xl text-cosmic-cobalt">
                ⟡
              </div>
              <h3 className="font-serif text-2xl mb-4 text-foreground">Growth</h3>
              <p className="text-muted font-light leading-relaxed">
                Use your chart as a map for self-understanding. Practical insights for modern life, grounded in ancient observation.
              </p>
            </div>
          </div>
        </section>
        */}

            {/* Big Feature Section with Background Text */}
            <section className="relative py-32 sm:py-40 overflow-hidden">
              {/* Large Background Text */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
                <span className="font-editorial text-[20rem] sm:text-[28rem] lg:text-[36rem] text-foreground/[0.03] leading-none tracking-tighter">
                  Sidereal
                </span>
              </div>

              {/* Content */}
              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                {/* Left Column */}
                <div className="lg:col-span-5">
                  <motion.h2
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="font-editorial text-4xl sm:text-5xl lg:text-6xl text-foreground leading-[1.1] mb-8"
                  >
                    Your true sign
                    <br />
                    <span className="italic text-cosmic-purple">revealed.</span>
                  </motion.h2>

                  {/* Social Proof */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    viewport={{ once: true }}
                    className="flex items-center gap-4"
                  >
                    {/* Avatars */}
                    <div className="flex -space-x-3">
                      {["E", "M", "P", "J"].map((letter, i) => (
                        <div
                          key={i}
                          className="w-10 h-10 rounded-full bg-gradient-to-br from-cosmic-purple to-cosmic-lavender flex items-center justify-center text-white text-sm font-medium border-2 border-background"
                        >
                          {letter}
                        </div>
                      ))}
                    </div>
                    <div>
                      <div className="flex items-center gap-1 mb-0.5">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className="text-cosmic-gold text-sm">
                            ★
                          </span>
                        ))}
                      </div>
                      <p className="text-sm text-muted">
                        12,000+ charts generated
                      </p>
                    </div>
                  </motion.div>
                </div>

                {/* Center - Visual Element */}
                <div className="lg:col-span-3 flex justify-center">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    viewport={{ once: true }}
                    className="relative"
                  >
                    {/* Zodiac Wheel Visual */}
                    <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-full border-2 border-cosmic-purple/20 flex items-center justify-center relative">
                      <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-full border border-cosmic-lavender/40 flex items-center justify-center">
                        <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-cosmic-lavender/30 to-cosmic-purple/20 flex items-center justify-center">
                          <span className="text-4xl sm:text-5xl">☉</span>
                        </div>
                      </div>
                      {/* Orbiting dots */}
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 20,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="absolute inset-0"
                      >
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 w-3 h-3 bg-cosmic-purple rounded-full" />
                      </motion.div>
                      <motion.div
                        animate={{ rotate: -360 }}
                        transition={{
                          duration: 30,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="absolute inset-2"
                      >
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1 w-2 h-2 bg-cosmic-lavender rounded-full" />
                      </motion.div>
                    </div>
                  </motion.div>
                </div>

                {/* Right Column */}
                <div className="lg:col-span-4">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    viewport={{ once: true }}
                    className="text-right"
                  >
                    <p className="text-xl sm:text-2xl text-foreground leading-relaxed font-light">
                      What makes Veas different:
                    </p>
                    <ul className="mt-4 space-y-3 text-base sm:text-lg text-foreground/80">
                      <li>
                        Aligned with the actual sky using NASA JPL ephemeris
                        data
                      </li>
                      <li>Rooted in 5,000 years of Jyotish wisdom</li>
                      <li>Designed for the modern mind, clear and grounded</li>
                    </ul>
                  </motion.div>
                </div>
              </div>
            </section>
          </main>
          {/* Scrolling Text Banner */}
          <PricingSection />
          <ScrollingTextBanner />
          {/* Bold Vedic Section - Full Width */}

          <div className="bg-background">
            <main className="relative z-10 mx-auto max-w-7xl px-6 sm:px-12">
              {/* Courses Section 
        <section className="py-24">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
              <h2 className="font-editorial text-4xl sm:text-5xl mb-4 text-foreground">Curated Paths</h2>
              <p className="text-muted max-w-md">Deepen your understanding with our expert-led courses.</p>
            </div>
            <Link href="/courses" className="text-cosmic-cobalt hover:text-foreground transition-colors border-b border-transparent hover:border-foreground pb-0.5 text-sm uppercase tracking-widest">
              View All Academy ⟶
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {courses.map((course, i) => (
              <CourseCard key={i} {...course} />
            ))}
          </div>
        </section>
*/}
              {/* Pricing Section */}
            </main>
          </div>

          {/* Testimonials Section - Full Width with Gradient */}
          <TestimonialsSection />

          <section className="relative z-10 bg-cosmic-lavender overflow-hidden">
            {/* Scrolling Announcement Bar */}
            <div className="bg-foreground text-white py-3 overflow-hidden">
              <motion.div
                animate={{ x: [0, -1000] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="flex items-center gap-8 whitespace-nowrap"
              >
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center gap-8">
                    <span className="text-sm tracking-wide">
                      The precession shifts 1° every 72 years
                    </span>
                    <span className="text-cosmic-purple">✦</span>
                    <span className="text-sm tracking-wide">
                      Your true sign awaits discovery
                    </span>
                    <span className="text-cosmic-purple">✦</span>
                    <span className="text-sm tracking-wide">
                      5,000 years of Vedic wisdom
                    </span>
                    <span className="text-cosmic-purple">✦</span>
                    <span className="text-sm tracking-wide">
                      Aligned with NASA JPL ephemeris data
                    </span>
                    <span className="text-cosmic-purple">✦</span>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Main Content */}
            <div className="relative min-h-[80vh] flex flex-col justify-between py-12 px-6 sm:px-12">
              {/* Center - Large Typography */}
              <div className="flex-1 flex items-center justify-center relative">
                {/* Background Zodiac Wheel */}
                <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
                  <div className="w-[500px] h-[500px] sm:w-[600px] sm:h-[600px] lg:w-[700px] lg:h-[700px] rounded-full border-2 border-foreground/30 relative">
                    <div className="absolute inset-8 rounded-full border border-foreground/20" />
                    <div className="absolute inset-16 rounded-full border border-dashed border-foreground/20" />
                    {/* Zodiac symbols around the wheel */}
                    {[
                      "♈",
                      "♉",
                      "♊",
                      "♋",
                      "♌",
                      "♍",
                      "♎",
                      "♏",
                      "♐",
                      "♑",
                      "♒",
                      "♓",
                    ].map((symbol, i) => (
                      <div
                        key={i}
                        className="absolute text-2xl text-foreground/40"
                        style={{
                          top: `${50 - 45 * Math.cos(((i * 30 - 90) * Math.PI) / 180)}%`,
                          left: `${50 + 45 * Math.sin(((i * 30 - 90) * Math.PI) / 180)}%`,
                          transform: "translate(-50%, -50%)",
                        }}
                      >
                        {symbol}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Main Text */}
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                  className="relative z-10 text-center"
                >
                  <h2 className="font-editorial text-[4rem] sm:text-[7rem] lg:text-[10rem] xl:text-[12rem] leading-[0.85] text-foreground tracking-tight">
                    Jyotish
                  </h2>
                  <p className="font-serif italic text-2xl sm:text-3xl lg:text-4xl text-foreground/60 mt-4">
                    The Science of Light
                  </p>
                </motion.div>
              </div>

              {/* Bottom Info Row */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
                className="flex flex-col sm:flex-row justify-between items-center gap-8 pt-12"
              >
                <div className="text-center sm:text-left">
                  <p className="font-mono text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground tracking-tight">
                    ~24°
                  </p>
                  <p className="text-sm text-foreground/60 uppercase tracking-widest mt-1">
                    Ayanamsa Shift
                  </p>
                </div>

                <div className="text-center">
                  <p className="font-mono text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground tracking-tight">
                    5000+
                  </p>
                  <p className="text-sm text-foreground/60 uppercase tracking-widest mt-1">
                    Years of Tradition
                  </p>
                </div>

                <div className="text-center sm:text-right">
                  <p className="font-mono text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground tracking-tight">
                    Bharat
                  </p>
                  <p className="text-sm text-foreground/60 uppercase tracking-widest mt-1">
                    Origin
                  </p>
                </div>
              </motion.div>
            </div>
          </section>

          {/* FAQ Section */}
          <FAQSection />

          {/* CTA Section - Add liquid bg here */}
          <section className="relative z-10 py-32 px-6 sm:px-12 overflow-hidden">
            {/* Background placeholder for liquid effect */}
            <div className="absolute inset-0 bg-foreground" />

            <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm mb-8"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-cosmic-purple animate-pulse" />
                <span className="text-[11px] uppercase tracking-[0.2em] text-white/70">
                  The sky hasn&apos;t changed — only our understanding
                </span>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
                className="font-editorial text-4xl sm:text-6xl lg:text-7xl leading-[1] text-white mb-6"
              >
                Ready to see{" "}
                <span className="italic text-cosmic-lavender">
                  the real you?
                </span>
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className="text-lg text-white/60 mb-10 max-w-xl"
              >
                The sky hasn&apos;t changed — only our understanding of it has.
                Discover what the heavens actually looked like when you were
                born.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Link href="/signup">
                  <button className="h-14 px-10 rounded-full bg-cosmic-purple text-white font-medium hover:bg-cosmic-lavender hover:text-foreground transition-colors tracking-wide text-sm uppercase">
                    Get Your Chart Free
                  </button>
                </Link>
                <Link href="/pricing">
                  <button className="h-14 px-10 rounded-full border border-white/30 text-white hover:bg-white/10 transition-colors tracking-wide text-sm uppercase">
                    See Plans
                  </button>
                </Link>
              </motion.div>
            </div>
          </section>

          {/* Detailed Footer */}
          <footer className="relative z-10 bg-foreground text-white">
            {/* Main Footer Content */}
            <div className="max-w-7xl mx-auto px-6 sm:px-12 py-16">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
                {/* Brand Column */}
                <div className="lg:col-span-2">
                  <span className="font-serif italic text-3xl text-white mb-4 block">
                    veas
                  </span>
                  <p className="text-white/50 text-sm leading-relaxed max-w-sm mb-6">
                    Veas — Authentic Vedic astrology, aligned with the true sky.
                    Based on NASA JPL Ephemeris data.
                  </p>
                  <div className="flex gap-4">
                    <a
                      href="#"
                      className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                    >
                      <span className="text-sm">𝕏</span>
                    </a>
                    <a
                      href="#"
                      className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                    >
                      <span className="text-sm">in</span>
                    </a>
                    <a
                      href="#"
                      className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                    >
                      <span className="text-sm">IG</span>
                    </a>
                  </div>
                </div>

                {/* Navigation */}
                <div>
                  <h4 className="text-xs uppercase tracking-widest text-white/40 mb-4">
                    Navigate
                  </h4>
                  <ul className="space-y-3">
                    <li>
                      <a
                        href="#"
                        className="text-sm text-white/70 hover:text-white transition-colors"
                      >
                        Home
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="text-sm text-white/70 hover:text-white transition-colors"
                      >
                        About Sidereal
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="text-sm text-white/70 hover:text-white transition-colors"
                      >
                        Get Your Chart
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="text-sm text-white/70 hover:text-white transition-colors"
                      >
                        Academy
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="text-sm text-white/70 hover:text-white transition-colors"
                      >
                        Pricing
                      </a>
                    </li>
                  </ul>
                </div>

                {/* Resources */}
                <div>
                  <h4 className="text-xs uppercase tracking-widest text-white/40 mb-4">
                    Resources
                  </h4>
                  <ul className="space-y-3">
                    <li>
                      <a
                        href="#"
                        className="text-sm text-white/70 hover:text-white transition-colors"
                      >
                        Blog
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="text-sm text-white/70 hover:text-white transition-colors"
                      >
                        Planetary Calendar
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="text-sm text-white/70 hover:text-white transition-colors"
                      >
                        Free Birth Chart
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="text-sm text-white/70 hover:text-white transition-colors"
                      >
                        Manifesto
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="text-sm text-white/70 hover:text-white transition-colors"
                      >
                        FAQ
                      </a>
                    </li>
                  </ul>
                </div>

                {/* Legal */}
                <div>
                  <h4 className="text-xs uppercase tracking-widest text-white/40 mb-4">
                    Legal
                  </h4>
                  <ul className="space-y-3">
                    <li>
                      <a
                        href="#"
                        className="text-sm text-white/70 hover:text-white transition-colors"
                      >
                        Privacy Policy
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="text-sm text-white/70 hover:text-white transition-colors"
                      >
                        Terms of Service
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="text-sm text-white/70 hover:text-white transition-colors"
                      >
                        Cookie Policy
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="text-sm text-white/70 hover:text-white transition-colors"
                      >
                        Refund Policy
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="text-sm text-white/70 hover:text-white transition-colors"
                      >
                        Contact
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-white/10">
              <div className="max-w-7xl mx-auto px-6 sm:px-12 py-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                <span className="text-xs text-white/40">
                  © 2024 Veas Astrology. All rights reserved.
                </span>
                <div className="flex items-center gap-6 text-xs text-white/40">
                  <span>Made with ✧ for the cosmos</span>
                  <span className="hidden sm:inline">•</span>
                  <span className="hidden sm:inline">
                    Based on NASA JPL Ephemeris data
                  </span>
                </div>
              </div>
            </div>
          </footer>
        </div>
        {/* End of content wrapper */}
      </div>
    </SmoothScroll>
  );
}
