/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./src/**/*.{js,jsx,ts,tsx}"],
	theme: {
		extend: {
			colors: {
				bkg: "rgb(var(--color-bkg) / <alpha-value>)",
				content: "rgb(var(--color-content) / <alpha-value>)",
				navBkg: "rgb(var(--color-nav-bkg) / <alpha-value>)"
			}
		}
	},
	plugins: [require("daisyui"),]
};
