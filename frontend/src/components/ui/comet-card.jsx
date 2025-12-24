'use client';

import { useRef, useState, useEffect } from 'react';

export function CometCard({ children, className = '' }) {
    const cardRef = useRef(null);
    const [rotateX, setRotateX] = useState(0);
    const [rotateY, setRotateY] = useState(0);
    const [opacity, setOpacity] = useState(0);

    const handleMouseMove = (e) => {
        if (!cardRef.current) return;

        const rect = cardRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Calculate rotation based on cursor position
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateXValue = ((y - centerY) / centerY) * -25; // Increased max tilt to 25 deg
        const rotateYValue = ((x - centerX) / centerX) * 25;

        setRotateX(rotateXValue);
        setRotateY(rotateYValue);
        setOpacity(1);
    };

    const handleMouseLeave = () => {
        setRotateX(0);
        setRotateY(0);
        setOpacity(0);
    };

    return (
        <div
            className={`perspective-1000 relative transform-gpu transition-all duration-300 ease-out group ${className}`}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            ref={cardRef}
        >
            <div
                className="w-full h-full transition-transform duration-200 ease-out preserve-3d group-hover:scale-110 will-change-transform" // Added scale expand effect
                style={{
                    transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
                }}
            >
                {children}

                {/* Shine Effect */}
                <div
                    className="absolute inset-0 pointer-events-none rounded-[16px] z-20"
                    style={{
                        background: `radial-gradient(circle at ${50 + rotateY * 2}% ${50 + rotateX * 2}%, rgba(255,255,255,0.1) 0%, transparent 50%)`,
                        opacity: opacity,
                        mixBlendMode: 'overlay',
                    }}
                />

                {/* Border Glow */}
                <div
                    className="absolute inset-0 rounded-[16px] transition-opacity duration-300 pointer-events-none -z-10"
                    style={{
                        opacity: opacity,
                        background: `linear-gradient(${135 + rotateY * 5}deg, rgba(207,251,84,0.4), rgba(168,85,247,0.4))`,
                        filter: 'blur(15px)',
                        transform: 'translateZ(-1px) scale(0.95)'
                    }}
                />
            </div>
        </div>
    );
}

export function CometCardDemo() {
    return (
        <CometCard>
            <button
                type="button"
                className="mx-auto flex w-80 cursor-pointer flex-col items-stretch rounded-[16px] border border-white/10 bg-[#1F2121] p-2 saturate-0 md:p-4 hover:border-[#CFFB54]/50 transition-colors duration-300"
                aria-label="View invite F7RA"
                style={{
                    transformStyle: "preserve-3d",
                    transform: "none",
                    opacity: 1,
                }}>
                <div className="mx-2 flex-1">
                    <div className="relative mt-2 aspect-[3/4] w-full overflow-hidden rounded-[16px]">
                        <img
                            loading="lazy"
                            className="absolute inset-0 h-full w-full object-cover contrast-100 hover:contrast-125 transition-all duration-500"
                            alt="Invite background"
                            src="https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=2664&auto=format&fit=crop"
                            style={{
                                boxShadow: "rgba(0, 0, 0, 0.05) 0px 5px 6px 0px",
                                opacity: 1,
                            }} />

                        {/* Overlay Text */}
                        <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                            <p className="text-[#CFFB54] font-bold text-lg">Genesis Member</p>
                            <p className="text-white/60 text-xs">Tier 1 • Reputation 100+</p>
                        </div>
                    </div>
                </div>
                <div
                    className="mt-4 flex flex-shrink-0 items-center justify-between p-2 font-mono text-white">
                    <div className="text-xs flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#CFFB54] animate-pulse"></span>
                        Atlas DAO Pass
                    </div>
                    <div className="text-xs text-gray-300 opacity-50">#0001</div>
                </div>
            </button>
        </CometCard>
    );
}
