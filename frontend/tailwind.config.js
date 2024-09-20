/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./src/**/*.{js,jsx,ts,tsx}"],
	theme: {
	  extend: {
		colors: {
		  bkg: "rgb(var(--color-bkg) / <alpha-value>)",
		  content: "rgb(var(--color-content) / <alpha-value>)",
		  content2: "rgb(var(--color-content2) / <alpha-value>)",
		  nav: "rgb(var(--color-nav) / <alpha-value>)",
		  navBkg: "rgb(var(--color-nav-bkg) / <alpha-value>)",
		  navBkg2: "rgb(var(--color-nav-bkg2) / <alpha-value>)",
		  icon: "rgb(var(--color-icon) / <alpha-value>)",
		  iconShadow: "rgb(var(--color-icon-shadow) / <alpha-value>)",
		  txtBtn: "rgb(var(--color-btntxt) / <alpha-value>)",
		  hver: "rgb(var(--color-hver) / <alpha-value>)",
		  navSelect: "rgb(var(--color-navHighlight) / <alpha-value>)",
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
  