"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export const TextReveal = ({ text, className = "" }) => {
    const targetRef = useRef(null);

    const { scrollYProgress } = useScroll({
        target: targetRef,
        // Start tracking when the *top* of the container hits the *top* of the viewport
        // End tracking when the *bottom* of the container hits the *bottom* of the viewport
        offset: ["start start", "end end"],
    });

    const words = text.split(" ");

    return (
        // Increase height to allow sufficient scroll distance for the effect (300vh)
        <div ref={targetRef} className={`relative z-0 min-h-[300vh] ${className}`}>
            {/* Sticky container that holds the text in the center of the viewport */}
            <div className="sticky top-0 flex h-screen items-center justify-center bg-[#0B0C0C]">
                <p className="flex flex-wrap p-5 text-4xl font-bold text-white/10 md:text-5xl lg:text-7xl max-w-5xl justify-center leading-tight">
                    {words.map((word, i) => {
                        const start = i / words.length;
                        const end = start + (1 / words.length);
                        return (
                            <Word key={i} progress={scrollYProgress} range={[start, end]}>
                                {word}
                            </Word>
                        );
                    })}
                </p>
            </div>
        </div>
    );
};

// Component for each individual word
const Word = ({ children, progress, range }) => {
    const opacity = useTransform(progress, range, [0, 1]);
    return (
        <span className="relative mx-1 lg:mx-2.5">
            <span className={"absolute opacity-10"}>{children}</span>
            <motion.span style={{ opacity: opacity }} className={"text-[#CFFB54]"}>
                {children}
            </motion.span>
        </span>
    );
};
