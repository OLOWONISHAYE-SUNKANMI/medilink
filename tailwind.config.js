/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#1A6FE8",
        primaryLight: "#4A93FF",
        primaryDark: "#0D4DB0",
        primaryGhost: "rgba(26, 111, 232, 0.12)",
        
        accent: "#00C9A7",
        accentLight: "#4DDDCA",
        accentDark: "#009E83",
        accentGhost: "rgba(0, 201, 167, 0.12)",
        
        success: "#22C55E",
        warning: "#F59E0B",
        danger: "#EF4444",
        info: "#3B82F6",
        
        background: "#0C0F1E",
        surface: "#141829",
        surfaceElevated: "#1C2235",
        surfaceHighlight: "#242B42",
        
        border: "rgba(255,255,255,0.08)",
        borderStrong: "rgba(255,255,255,0.16)",
        
        textPrimary: "#F0F4FF",
        textSecondary: "#8892AC",
        textMuted: "#5A6480",
      },
      spacing: {
        xs: 4,
        sm: 8,
        md: 16,
        lg: 24,
        xl: 32,
        xxl: 48,
      },
      borderRadius: {
        sm: 8,
        md: 12,
        lg: 16,
        xl: 24,
        full: 9999,
      },
      fontSize: {
        h1: [32, { lineHeight: 40, fontWeight: "800", letterSpacing: -0.5 }],
        h2: [24, { lineHeight: 32, fontWeight: "700", letterSpacing: -0.3 }],
        h3: [20, { lineHeight: 28, fontWeight: "600" }],
        h4: [17, { lineHeight: 24, fontWeight: "600" }],
        b1: [16, { lineHeight: 24, fontWeight: "400" }],
        b2: [14, { lineHeight: 20, fontWeight: "400" }],
        cap: [12, { lineHeight: 16, fontWeight: "400" }],
        lab: [13, { lineHeight: 18, fontWeight: "600", letterSpacing: 0.5 }],
      },
    },
  },
  plugins: [],
}
