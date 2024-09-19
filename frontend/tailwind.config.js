/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./src/**/*.{js,jsx,ts,tsx}"],
	theme: {
	  extend: {
		colors: {
		  bkg: "rgb(var(--color-bkg) / <alpha-value>)",
		  content: "rgb(var(--color-content) / <alpha-value>)",
		  navBkg: "rgb(var(--color-nav-bkg) / <alpha-value>)"
		},
		fontFamily: {
		  custom: ['CustomFont']  // Add your custom font family here
		},
		clipPath: {
		  'custom-arch': 'ellipse(75% 40% at 50% 0%)',
		}
	  }
	},
	plugins: [
	  require('tailwind-clip-path'),  // Already included
	  require('@tailwindcss/line-clamp'),  // Add the line-clamp plugin
	  require('tailwind-scrollbar'),
	],
  };
  