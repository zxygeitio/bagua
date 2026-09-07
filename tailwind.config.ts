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
          canvas: 'var(--paper-canvas)',
          surface: 'var(--paper-surface)',
          fiber: 'var(--paper-fiber)',
          text: 'var(--paper-ink)',
          muted: 'var(--paper-muted)',
          primary: 'var(--paper-cinnabar)',
          accent: 'var(--paper-cinnabar)',
          border: 'var(--paper-rule)',
          wash: 'var(--paper-wash)',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'Cubic 11', 'ui-monospace', 'monospace'],
        body: ['var(--font-body)', 'Noto Serif SC', 'Songti SC', 'serif'],
        classical: ['var(--font-body)', 'Noto Serif SC', 'Songti SC', 'serif'],
        calligraphy: ['var(--font-body)', 'Noto Serif SC', 'Songti SC', 'serif'],
      },
      borderRadius: {
        none: '0',
        card: '0',
        button: '0',
        pill: '0',
      },
      boxShadow: {
        pixel: '4px 4px 0 var(--paper-ink)',
        soft: '4px 4px 0 rgba(44,36,22,0.18)',
      },
      animation: {
        'fade-in': 'enterUp var(--motion-entrance) steps(6, end) both',
        'fade-up': 'enterUp var(--motion-entrance) steps(6, end) both',
        'fade-down': 'enterUp var(--motion-entrance) steps(6, end) both',
        'scale-in': 'enterUp var(--motion-entrance) steps(6, end) both',
      },
    },
  },
  plugins: [],
}

export default config
