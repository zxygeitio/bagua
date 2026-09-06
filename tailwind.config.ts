import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bagua: {
          canvas: '#FBF8F0',
          surface: '#FFFFFF',
          glass: 'rgba(255,255,255,0.7)',
          primary: '#6366F1',
          secondary: '#10B981',
          accent: '#F59E0B',
          text: '#1F2937',
          muted: '#6B7280',
          border: '#E5E7EB',
        },
      },
      fontFamily: {
        display: ['"Noto Serif SC"', 'serif'],
        calligraphy: ['"Ma Shan Zheng"', 'cursive'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card: '16px',
        button: '12px',
      },
    },
  },
  plugins: [],
};

export default config;
