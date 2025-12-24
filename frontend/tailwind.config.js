/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "#050505",
                card: "rgba(20, 20, 20, 0.7)",
                primary: "#CFFB54",
                secondary: "#A855F7",
                "accent-blue": "#3B82F6",
                "text-primary": "#FFFFFF",
                "text-muted": "#94A3B8",
                "border-subtle": "rgba(255, 255, 255, 0.1)",
            },
            fontFamily: {
                outfit: ["var(--font-outfit)", "sans-serif"],
            },
        },
    },
    plugins: [],
};
