const colors = {
  background: "#0b0f14",
  surface: "#0f1419",
  primary: "#225ba1ff",
  primaryDark: "#103c72ff",
  accent: "#00d4ff",
  text: "#e6eef8",
  mutedText: "#9aa6b2",
  inputBg: "#0b0f14",
  inputBorder: "#434f57ff",
  danger: "#ff6b6b",
};

const spacing = {
  xs: 6,
  sm: 10,
  md: 16,
  lg: 24,
  xl: 32,
};

const radii = {
  sm: 6,
  md: 10,
  lg: 14,
};

const fonts = {
  fontFamily: "System",
  sizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 20,
    xl: 26,
    title: 40,
  },
  weights: {
    regular: "400" as const,
    medium: "500" as const,
    bold: "700" as const,
  },
};

export default {
  colors,
  spacing,
  radii,
  fonts,
};
