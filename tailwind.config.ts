import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        bagua: {
          canvas: '#FBF8F0',
          surface: '#FFFFFF',
          glass: 'rgba(255,255,255,0.6)',
          primary: {
            DEFAULT: '#6366F1',
            50: '#EEF2FF',
            100: '#E0E7FF',
            500: '#6366F1',
            600: '#4F46E5',
            900: '#312E81',
          },
          secondary: {
            DEFAULT: '#10B981',
            50: '#ECFDF5',
            500: '#10B981',
            600: '#059669',
            900: '#064E3B',
          },
          accent: {
            DEFAULT: '#F59E0B',
            50: '#FFFBEB',
            500: '#F59E0B',
            600: '#D97706',
            900: '#78350F',
          },
          text: '#1F2937',
          muted: '#6B7280',
          border: 'rgba(229,231,235,0.5)',
        },
        ink: {
          red: '#DC2626',
          gold: '#B45309',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'Noto Serif SC', 'serif'],
        calligraphy: ['var(--font-calligraphy)', 'Ma Shan Zheng', 'cursive'],
        body: ['var(--font-body)', 'Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card: '20px',
        button: '12px',
        pill: '9999px',
      },
      boxShadow: {
        soft: '0 4px 20px rgba(99,102,241,0.08)',
        glow: '0 0 40px rgba(99,102,241,0.15)',
        gold: '0 4px 20px rgba(245,158,11,0.15)',
        jade: '0 4px 20px rgba(16,185,129,0.15)',
        inset: 'inset 0 1px 2px rgba(0,0,0,0.05)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'fade-up': 'fadeUp 0.5s ease-out',
        'slide-up': 'slideUp 0.4s cubic-bezier(0.16,1,0.3,1)',
        'shimmer': 'shimmer 2s infinite linear',
        'float': 'float 6s ease-in-out infinite',
        'spin-slow': 'spin 8s linear infinite',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        fadeUp: { '0%': { opacity: '0', transform: 'translateY(20px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        slideUp: { '0%': { transform: 'translateY(10px)', opacity: '0' }, '100%': { transform: 'translateY(0)', opacity: '1' } },
        shimmer: { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
        float: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-10px)' } },
      },
      backgroundImage: {
        'paper-texture': "url(\"data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence baseFrequency='0.9' numOctaves='2' /%3E%3CfeColorMatrix values='0 0 0 0 0.7 0 0 0 0 0.65 0 0 0 0 0.55 0 0 0 0.04 0' /%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23n)'/%3E%3C/svg%3E\")",
        'gradient-radial': 'radial-gradient(ellipse at center, var(--tw-gradient-stops))',
        'gradient-bagua': 'linear-gradient(135deg, #6366F1 0%, #10B981 50%, #F59E0B 100%)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}

export default config
