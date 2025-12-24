"use client";
import React, { useRef, useEffect, useState } from "react";

export const GlowingEffect = ({
    spread = 40,
    glow = true,
    disabled = false,
    proximity = 64,
    inactiveZone = 0.01
}) => {
    const cardRef = useRef(null);
    const [position, setPosition] = useState({ x: 0, y: 0, visible: false });

    useEffect(() => {
        if (!glow || disabled || !cardRef.current) return;

        const card = cardRef.current.parentElement; // Assumes it is placed inside the card container relative
        if (!card) return;

        const handleMouseMove = (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const isVisible =
                x >= -proximity &&
                x <= rect.width + proximity &&
                y >= -proximity &&
                y <= rect.height + proximity;

            setPosition({ x, y, visible: isVisible });
        };

        const handleMouseLeave = () => {
            setPosition((prev) => ({ ...prev, visible: false }));
        };

        window.addEventListener("mousemove", handleMouseMove); // Track globally to handle proximity
        // Optimization: could be scoped, but global ensures smooth proximity entry

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
        };
    }, [glow, disabled, proximity]);

    if (disabled) return null;

    return (
        <div
            ref={cardRef}
            className="absolute inset-0 -z-10 overflow-hidden rounded-[inherit] pointer-events-none"
        >
            <div
                className="absolute inset-0 transition-opacity duration-300"
                style={{
                    opacity: position.visible ? 1 : 0,
                    background: `radial-gradient(${spread}px circle at ${position.x}px ${position.y}px, rgba(207, 251, 84, 0.15), transparent 40%)`
                }}
            />
            {/* Border Glow */}
            <div
                className="absolute inset-0 rounded-[inherit]"
                style={{
                    opacity: position.visible ? 1 : 0,
                    background: `radial-gradient(${spread * 2}px circle at ${position.x}px ${position.y}px, rgba(207, 251, 84, 0.4), transparent 40%)`,
                    mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                    maskComposite: "exclude",
                    padding: "1px" // Border width
                }}
            />
        </div>
    );
};
