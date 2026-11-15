/** @type {import('tailwindcss').Config} */
export default {
	darkMode: 'class',
	content: ['./index.html', './src/**/*.{ts,tsx}'],
	theme: {
		extend: {
			fontFamily: {
				sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
			},
			colors: {
				bg: 'rgb(var(--bg) / <alpha-value>)',
				fg: 'rgb(var(--fg) / <alpha-value>)',
				muted: 'rgb(var(--muted) / <alpha-value>)',
				border: 'rgb(var(--border) / <alpha-value>)',
				accent: 'rgb(var(--accent) / <alpha-value>)',
				'accent-fg': 'rgb(var(--accent-fg) / <alpha-value>)',
				danger: 'rgb(var(--danger) / <alpha-value>)',
			},
		},
	},
	plugins: [],
}
