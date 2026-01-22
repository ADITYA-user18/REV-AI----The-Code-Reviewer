/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // We define our "Cyberpunk" palette here
        'github-dark': '#0d1117',
        'github-card': '#161b22',
        'neon-blue': '#58a6ff',
        'neon-green': '#238636',
        'neon-purple': '#8957e5',
        'danger': '#da3633',
      },
      fontFamily: {
        mono: ['JetBrains Mono','Fira Code', 'monospace'], // For that developer feel
      }
    },
  },
  plugins: [],
}