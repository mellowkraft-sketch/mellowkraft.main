/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: 'hsl(var(--primary))',
        'primary-foreground': 'hsl(var(--primary-foreground))',
        secondary: 'hsl(var(--secondary))',
        'secondary-foreground': 'hsl(var(--secondary-foreground))',
        accent: 'hsl(var(--accent))',
        'accent-foreground': 'hsl(var(--accent-foreground))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        destructive: 'hsl(var(--destructive))',
        'destructive-foreground': 'hsl(var(--destructive-foreground))',
        mk: {
          bg:       "#FAFAF8",
          card:     "#FFFFFF",
          surface:  "#F5F2ED",
          border:   "#E8D9DF",
          text:     "#1C1917",
          accent:   "#C97A93",
          green:    { DEFAULT: "#6EBD94", bg: "#D8F0E4" },
          pink:     { DEFAULT: "#C97A93", bg: "#FCE8EF" },
          lavender: { DEFAULT: "#9B8EC4", bg: "#EDE8F8" },
          sky:      { DEFAULT: "#6BAACF", bg: "#DDF0FA" },
          amber:    { DEFAULT: "#C9A96E", bg: "#FDF4E8" },
        },
      },
    },
  },
  plugins: [],
}
