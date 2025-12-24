"use client";
import React from "react";
import { motion } from "framer-motion";

export const LampContainer = ({
    children,
    className,
}) => {
    return (
        <div
            className={`relative flex min-h-[70vh] md:min-h-[80vh] flex-col items-center justify-center overflow-hidden w-full rounded-3xl z-0 bg-[#0B0C0C] ${className}`}
        >
            <div className="relative flex w-full flex-1 scale-y-125 items-center justify-center isolate z-0">
                <motion.div
                    initial={{ opacity: 0.5, width: "15rem" }}
                    whileInView={{ opacity: 1, width: "30rem" }}
                    transition={{
                        delay: 0.3,
                        duration: 0.8,
                        ease: "easeInOut",
                    }}
                    style={{
                        backgroundImage: `conic-gradient(var(--conic-position), var(--tw-gradient-stops))`,
                    }}
                    className="absolute inset-auto right-1/2 h-56 overflow-visible w-[30rem] bg-gradient-conic from-[#CFFB54] via-transparent to-transparent text-white [--conic-position:from_70deg_at_center_top]"
                >
                    <div className="absolute w-[100%] left-0 bg-[#0B0C0C] h-40 bottom-0 z-20 [mask-image:linear-gradient(to_top,#0B0C0C,transparent)]" />
                    <div className="absolute w-40 h-[100%] left-0 bg-[#0B0C0C] bottom-0 z-20 [mask-image:linear-gradient(to_right,#0B0C0C,transparent)]" />
                </motion.div>
                <motion.div
                    initial={{ opacity: 0.5, width: "15rem" }}
                    whileInView={{ opacity: 1, width: "30rem" }}
                    transition={{
                        delay: 0.3,
                        duration: 0.8,
                        ease: "easeInOut",
                    }}
                    style={{
                        backgroundImage: `conic-gradient(var(--conic-position), var(--tw-gradient-stops))`,
                    }}
                    className="absolute inset-auto left-1/2 h-56 w-[30rem] bg-gradient-conic from-transparent via-transparent to-[#CFFB54] text-white [--conic-position:from_290deg_at_center_top]"
                >
                    <div className="absolute w-40 h-[100%] right-0 bg-[#0B0C0C] bottom-0 z-20 [mask-image:linear-gradient(to_left,#0B0C0C,transparent)]" />
                    <div className="absolute w-[100%] right-0 bg-[#0B0C0C] h-40 bottom-0 z-20 [mask-image:linear-gradient(to_top,#0B0C0C,transparent)]" />
                </motion.div>
                <div className="absolute top-1/2 h-48 w-full translate-y-12 scale-x-150 bg-[#0B0C0C] blur-3xl"></div>
                <div className="absolute top-1/2 z-50 h-48 w-full bg-transparent opacity-10 backdrop-blur-md"></div>
                <div className="absolute inset-auto z-50 h-36 w-[28rem] -translate-y-1/2 rounded-full bg-[#CFFB54] opacity-50 blur-3xl"></div>
                <motion.div
                    initial={{ width: "8rem" }}
                    whileInView={{ width: "16rem" }}
                    transition={{
                        delay: 0.3,
                        duration: 0.8,
                        ease: "easeInOut",
                    }}
                    className="absolute inset-auto z-30 h-36 w-64 -translate-y-[6rem] rounded-full bg-[#CFFB54] blur-2xl"
                ></motion.div>
                <motion.div
                    initial={{ width: "15rem" }}
                    whileInView={{ width: "30rem" }}
                    transition={{
                        delay: 0.3,
                        duration: 0.8,
                        ease: "easeInOut",
                    }}
                    className="absolute inset-auto z-50 h-0.5 w-[30rem] -translate-y-[7rem] bg-[#CFFB54]"
                ></motion.div>

                <div className="absolute inset-auto z-40 h-44 w-full -translate-y-[12.5rem] bg-gradient-to-b from-[#0B0C0C] to-transparent"></div>
            </div>

            {/* Children positioned BELOW the lamp light */}
            <div className="relative z-50 flex translate-y-0 flex-col items-center px-5 w-full pb-12">
                {children}
            </div>
        </div>
    );
};
