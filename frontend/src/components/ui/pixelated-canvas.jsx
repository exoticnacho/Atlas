'use client';

import { useEffect, useRef, useState } from 'react';

export function PixelatedCanvas({
    src,
    width = 400,
    height = 500,
    cellSize = 3,
    dotScale = 0.9,
    shape = 'square',
    backgroundColor = '#000000',
    dropoutStrength = 0.4,
    interactive = true,
    distortionStrength = 3,
    distortionRadius = 80,
    distortionMode = 'swirl',
    followSpeed = 0.2,
    jitterStrength = 4,
    jitterSpeed = 4,
    sampleAverage = true,
    tintColor = '#FFFFFF',
    tintStrength = 0.2,
    className = '',
    fadeOnLeave = true,
    fadeSpeed = 0.1,
}) {
    const canvasRef = useRef(null);
    const [imageData, setImageData] = useState(null);
    const mousePos = useRef({ x: -1000, y: -1000 });
    const targetMousePos = useRef({ x: -1000, y: -1000 });
    const isHovering = useRef(false);
    const distortionAmount = useRef(0); // 0 to 1

    useEffect(() => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = src;
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            // Set willReadFrequently for better performance
            ctx.drawImage(img, 0, 0, width, height);
            setImageData(ctx.getImageData(0, 0, width, height, { willReadFrequently: true }));
        };
    }, [src, width, height]);

    useEffect(() => {
        if (!imageData || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrame;
        let jitterOffset = 0;

        const draw = () => {
            // CLEAR CANVAS FIRST to prevent accumulation
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // If background color is not transparent, fill it
            if (backgroundColor && backgroundColor !== 'transparent') {
                ctx.fillStyle = backgroundColor;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }

            // Smooth mouse following
            mousePos.current.x += (targetMousePos.current.x - mousePos.current.x) * followSpeed;
            mousePos.current.y += (targetMousePos.current.y - mousePos.current.y) * followSpeed;

            // Smooth distortion fade in/out
            const targetDistortion = isHovering.current ? 1 : 0;
            distortionAmount.current += (targetDistortion - distortionAmount.current) * fadeSpeed;

            jitterOffset += jitterSpeed * 0.01;

            // Optimization: pre-calculate tint colors
            const tintR = parseInt(tintColor.slice(1, 3), 16);
            const tintG = parseInt(tintColor.slice(3, 5), 16);
            const tintB = parseInt(tintColor.slice(5, 7), 16);

            for (let y = 0; y < height; y += cellSize) {
                for (let x = 0; x < width; x += cellSize) {
                    const i = (y * width + x) * 4;
                    let r = imageData.data[i];
                    let g = imageData.data[i + 1];
                    let b = imageData.data[i + 2];
                    const a = imageData.data[i + 3];

                    // Skip fully transparent pixels
                    if (a === 0) continue;

                    // Simple dropout based on brightness/randomness
                    // Using a stable random value based on position to prevent flickering
                    const stableRandom = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
                    const randomVal = stableRandom - Math.floor(stableRandom);

                    if (randomVal > dropoutStrength) {
                        // Apply tint
                        if (tintStrength > 0) {
                            r = r * (1 - tintStrength) + tintR * tintStrength;
                            g = g * (1 - tintStrength) + tintG * tintStrength;
                            b = b * (1 - tintStrength) + tintB * tintStrength;
                        }

                        ctx.fillStyle = `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, ${a / 255})`;

                        let drawX = x;
                        let drawY = y;

                        // Simple interactive distortion
                        // Only calculate if there is significant distortion amount
                        if (interactive && distortionAmount.current > 0.01) {
                            const dx = x - mousePos.current.x;
                            const dy = y - mousePos.current.y;
                            const distance = Math.sqrt(dx * dx + dy * dy);

                            if (distance < distortionRadius) {
                                // Smooth falloff
                                const force = (1 - distance / distortionRadius) * distortionStrength * distortionAmount.current;

                                if (distortionMode === 'swirl') {
                                    const angle = Math.atan2(dy, dx);
                                    drawX += Math.cos(angle + force) * force * 5; // Multiplier to make swirl visible
                                    drawY += Math.sin(angle + force) * force * 5;
                                } else if (distortionMode === 'repel') {
                                    drawX += (dx / distance) * force * 10;
                                    drawY += (dy / distance) * force * 10;
                                } else {
                                    // attract
                                    drawX -= (dx / distance) * force * 10;
                                    drawY -= (dy / distance) * force * 10;
                                }
                            }

                            // Apply jitter only when interacting
                            if (jitterStrength > 0) {
                                drawX += Math.sin(jitterOffset + x * 0.1) * jitterStrength * distortionAmount.current;
                                drawY += Math.cos(jitterOffset + y * 0.1) * jitterStrength * distortionAmount.current;
                            }
                        }

                        const size = cellSize * dotScale;
                        if (shape === 'circle') {
                            ctx.beginPath();
                            ctx.arc(drawX + cellSize / 2, drawY + cellSize / 2, size / 2, 0, Math.PI * 2);
                            ctx.fill();
                        } else {
                            ctx.fillRect(drawX, drawY, size, size);
                        }
                    }
                }
            }

            animationFrame = requestAnimationFrame(draw);
        };

        draw();

        const handleMouseEnter = () => {
            isHovering.current = true;
        }

        const handleMouseMove = (e) => {
            const rect = canvas.getBoundingClientRect();
            targetMousePos.current = {
                x: ((e.clientX - rect.left) / rect.width) * width,
                y: ((e.clientY - rect.top) / rect.height) * height,
            };
        };

        const handleMouseLeave = () => {
            if (fadeOnLeave) {
                isHovering.current = false;
            } else {
                targetMousePos.current = { x: -1000, y: -1000 };
            }
        };

        if (interactive) {
            canvas.addEventListener('mouseenter', handleMouseEnter);
            canvas.addEventListener('mousemove', handleMouseMove);
            canvas.addEventListener('mouseleave', handleMouseLeave);
        }

        return () => {
            cancelAnimationFrame(animationFrame);
            if (interactive) {
                canvas.removeEventListener('mouseenter', handleMouseEnter);
                canvas.removeEventListener('mousemove', handleMouseMove);
                canvas.removeEventListener('mouseleave', handleMouseLeave);
            }
        };
    }, [imageData, interactive, cellSize, dotScale, shape, backgroundColor, dropoutStrength, distortionStrength, distortionRadius, distortionMode, followSpeed, jitterStrength, jitterSpeed, tintColor, tintStrength, width, height, fadeOnLeave, fadeSpeed]);

    return (
        <canvas
            ref={canvasRef}
            width={width}
            height={height}
            className={className}
        />
    );
}
