/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-dm-sans)', 'sans-serif'],
        mono: ['var(--font-dm-mono)', 'monospace'],
      },
      colors: {
        bg: {
          DEFAULT: '#0d0f14',
          2: '#13161d',
          3: '#1a1e28',
          4: '#222736',
        },
        border: {
          DEFAULT: '#2a2f3e',
          2: '#363d52',
        },
        accent: {
          DEFAULT: '#3b82f6',
          2: '#1d4ed8',
          glow: 'rgba(59,130,246,0.15)',
        },
      },
    },
  },
  plugins: [],
}
