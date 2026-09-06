import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  // Tailwind JIT 不会扫描动态拼接的 class，预先声明以确保生成。
  safelist: [
    'from-gold-500/8', 'via-transparent', 'to-transparent',
    'from-jade-500/8', 'from-indigo-500/8', 'from-vermilion-500/8', 'from-amber-700/8',
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
        // 深色博物馆主题 - 墨色/金/玉/朱/琥珀
        ink: {
          50: '#F5F5F4',
          100: '#E7E5E4',
          200: '#D6D3D1',
          300: '#A8A29E',
          400: '#78716C',
          500: '#57534E',
          600: '#3F3F46',
          700: '#27272A',
          800: '#1C1B1F',
          900: '#111113',
          950: '#08080A',
        },
        gold: {
          50: '#FEFCE8',
          100: '#FEF9C3',
          300: '#FDE68A',
          400: '#FBBF24',
          500: '#F59E0B',
          600: '#D97706',
          700: '#B45309',
        },
        jade: {
          100: '#D1FAE5',
          300: '#6EE7B7',
          400: '#34D399',
          500: '#10B981',
          600: '#059669',
          700: '#047857',
        },
        vermilion: {
          100: '#FEE2E2',
          300: '#FCA5A5',
          400: '#F87171',
          500: '#EF4444',
          600: '#DC2626',
          700: '#B91C1C',
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
        'fade-down': 'fadeDown 0.5s ease-out',
        'scale-in': 'scaleIn 0.5s cubic-bezier(0.16,1,0.3,1)',
        'slide-up': 'slideUp 0.4s cubic-bezier(0.16,1,0.3,1)',
        'shimmer': 'shimmer 2s infinite linear',
        'float': 'float 6s ease-in-out infinite',
        'spin-slow': 'spin 8s linear infinite',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        fadeUp: { '0%': { opacity: '0', transform: 'translateY(20px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        fadeDown: { '0%': { opacity: '0', transform: 'translateY(-12px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        scaleIn: { '0%': { opacity: '0', transform: 'scale(0.92)' }, '100%': { opacity: '1', transform: 'scale(1)' } },
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
