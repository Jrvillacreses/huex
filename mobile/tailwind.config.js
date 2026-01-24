/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {
            colors: {
                "primary": "#EF233C",
                "background-light": "#EDF2F4",
                "background-dark": "#2B2D42",
                "surface-light": "#FFFFFF",
                "surface-dark": "#8D99AE",
                "text-light": "#2B2D42",
                "text-dark": "#EDF2F4",
                "text-muted-light": "#8D99AE",
                "text-muted-dark": "#D9E2EC"
            },
            fontFamily: {
                "display": ["Lexend", "sans-serif"]
            },
            borderRadius: { "DEFAULT": "0.5rem", "lg": "0.75rem", "xl": "1rem", "full": "9999px" },
        },
    },
    plugins: [],
}
