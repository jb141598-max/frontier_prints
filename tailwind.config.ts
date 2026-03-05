import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          base: '#0d4a5b',
          ink: '#0a2c37',
          sand: '#f2eee4',
          accent: '#e56b2b'
        }
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Instrument Sans"', 'sans-serif']
      },
      boxShadow: {
        card: '0 10px 30px rgba(9, 32, 40, 0.12)'
      }
    }
  },
  plugins: []
};

export default config;
