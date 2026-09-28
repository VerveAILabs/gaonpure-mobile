export const Colors = {
  primary: '#1B4332',       // Deep Forest Green
  primaryDark: '#143326',
  primaryLight: '#2D6A4F',
  secondary: '#D4A373',     // Warm Golden Amber
  secondaryDark: '#BC8A58',
  secondaryLight: '#E2B88E',
  background: '#FBF8F3',    // Soft Organic Cream
  card: '#FFFFFF',          // Pure White
  text: {
    primary: '#1F2421',     // Charcoal Black
    muted: '#6B7280',       // Muted Gray
    light: '#9CA3AF',
    inverse: '#FFFFFF',
  },
  border: '#E5E7EB',
  borderLight: '#F3F4F6',
  status: {
    success: '#1B4332',
    warning: '#D4A373',
    error: '#DC2626',
    info: '#2563EB',
  },
} as const;

export type ColorScheme = typeof Colors;
