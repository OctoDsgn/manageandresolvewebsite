/** @type {import("tailwindcss").Config} */
// Loaded from app/globals.css via `@config` (Tailwind v4 legacy-config bridge),
// so brand tokens live here as named colours rather than hex values in components.
const config = {
  theme: {
    extend: {
      colors: {
        brand: {
          // Primary dark background + heading colour on light backgrounds.
          maroon: "#56181F",
          // Derived deep maroon — gradients and tinted surfaces on maroon.
          "maroon-deep": "#2B0C11",
          // True black: footer, credential strips, testimonials, newsletter card and body text.
          black: "#0B0B0C",
          // Primary accent: buttons, links, card top-borders, focus states.
          crimson: "#8F2D3B",
          // Alternate section backgrounds, dividers, light text on dark sections.
          "grey-light": "#D3D6D8",
          // Secondary borders; muted text on dark surfaces.
          "grey-mid": "#969695",
          // Derived darker grey for muted text on white — grey-mid alone
          // is below WCAG AA contrast for body-size text on white.
          "grey-dark": "#5E5E5D",
        },
      },
      fontFamily: {
        sans: ["var(--font-public-sans)", "system-ui", "sans-serif"],
        serif: ["Georgia", '"Times New Roman"', "serif"],
        logo: ["var(--font-poppins)", "system-ui", "sans-serif"],
      },
    },
  },
};

export default config;
