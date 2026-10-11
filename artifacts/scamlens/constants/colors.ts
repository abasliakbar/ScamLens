/**
 * Semantic design tokens for the mobile app.
 *
 * These tokens mirror the naming conventions used in web artifacts (index.css)
 * so that multi-artifact projects share a cohesive visual identity.
 *
 * Replace the placeholder values below with values that match the project's
 * brand. If a sibling web artifact exists, read its index.css and convert the
 * HSL values to hex so both artifacts use the same palette.
 *
 * To add dark mode, add a `dark` key with the same token names.
 * The useColors() hook will automatically pick it up.
 */

const colors = {
  light: {
    text: '#152824',
    tint: '#176B60',
    background: '#F3F7F5',
    foreground: '#152824',
    card: '#FFFFFF',
    cardForeground: '#152824',
    primary: '#176B60',
    primaryForeground: '#FFFFFF',
    secondary: '#E4EFEB',
    secondaryForeground: '#24463E',
    muted: '#EAF0ED',
    mutedForeground: '#64756F',
    accent: '#F1E5C8',
    accentForeground: '#654D16',
    destructive: '#B54747',
    destructiveForeground: '#FFFFFF',
    border: '#D9E4DF',
    input: '#D9E4DF',
    riskLow: '#28765F',
    riskLowBg: '#E4F2EB',
    riskMedium: '#94620B',
    riskMediumBg: '#FBF1D9',
    riskHigh: '#A43E3E',
    riskHighBg: '#F8E7E5',
  },
  dark: {
    text: '#E8F0EC',
    tint: '#73C7B0',
    background: '#101B19',
    foreground: '#E8F0EC',
    card: '#192724',
    cardForeground: '#E8F0EC',
    primary: '#73C7B0',
    primaryForeground: '#10201B',
    secondary: '#243632',
    secondaryForeground: '#D7E8E0',
    muted: '#202E2A',
    mutedForeground: '#A2B2AB',
    accent: '#40371F',
    accentForeground: '#EBD99E',
    destructive: '#D87575',
    destructiveForeground: '#1B1111',
    border: '#30423C',
    input: '#30423C',
    riskLow: '#81C9A6',
    riskLowBg: '#1C382D',
    riskMedium: '#E5BF63',
    riskMediumBg: '#3A301A',
    riskHigh: '#E68E88',
    riskHighBg: '#3A2221',
  },

  radius: 18,
};

export default colors;
