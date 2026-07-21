/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Space Grotesk', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
                heading: ['Space Grotesk', 'sans-serif'],
                body: ['Inter', 'system-ui', 'sans-serif'],
            },
            colors: {
                primary: 'rgba(var(--primary-rgb), <alpha-value>)',
                secondary: 'rgba(var(--secondary-rgb), <alpha-value>)',
                dark: 'rgba(var(--bg-deep-rgb), <alpha-value>)',
                card: 'rgba(var(--bg-card-rgb), <alpha-value>)',
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'hero-glow': 'conic-gradient(from 180deg at 50% 50%, var(--primary-glow) 0deg, var(--secondary-glow) 180deg, var(--primary-glow) 360deg)',
            }
        },
    },
    plugins: [],
}
