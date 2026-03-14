/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html","./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        cx: {
          bg: '#F7F6F2',
          surface: '#FFFFFF',
          card: '#FFFFFF',
          border: '#E8E5DE',
          border2: '#D4D0C8',
          indigo: '#4338CA',
          'indigo-light': '#EEF2FF',
          'indigo-mid': '#C7D2FE',
          amber: '#D97706',
          'amber-light': '#FEF3C7',
          emerald: '#059669',
          'emerald-light': '#D1FAE5',
          rose: '#E11D48',
          'rose-light': '#FFE4E6',
          sky: '#0284C7',
          'sky-light': '#E0F2FE',
          text: '#1C1917',
          sub: '#44403C',
          muted: '#78716C',
          faint: '#A8A29E',
          sidebar: '#F0EEE9',
        }
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', 'sans-serif'],
        body: ['"Figtree"', 'sans-serif'],
        mono: ['"Fira Code"', 'monospace'],
      },
      boxShadow: {
        'soft': '0 1px 3px 0 rgba(0,0,0,0.06), 0 1px 2px -1px rgba(0,0,0,0.04)',
        'card': '0 4px 16px -2px rgba(0,0,0,0.08), 0 1px 4px -1px rgba(0,0,0,0.04)',
        'lift': '0 8px 24px -4px rgba(0,0,0,0.12), 0 2px 8px -2px rgba(0,0,0,0.06)',
        'glow-indigo': '0 0 0 3px rgba(67,56,202,0.15)',
        'glow-amber': '0 0 0 3px rgba(217,119,6,0.15)',
      },
      animation: {
        'fade-up': 'fadeUp 0.4s ease-out',
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-right': 'slideRight 0.3s ease-out',
        'bounce-soft': 'bounceSoft 0.5s ease-out',
        'shimmer': 'shimmer 1.8s infinite',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideRight: {
          from: { opacity: '0', transform: 'translateX(-8px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        bounceSoft: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '60%': { transform: 'scale(1.02)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
}
