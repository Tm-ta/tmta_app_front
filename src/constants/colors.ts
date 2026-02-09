const BLACK = {
    '50': '#eaeaea',
    '100': '#bfbfbf',
    '200': '#a0a0a0',
    '300': '#747474',
    '400': '#595959',
    '500': '#303030',
    '600': '#2c2c2c',
    '700': '#222222',
    '800': '#1a1a1a',
    '900': '#141414',
  } as const;

const GRAY = {
  '900': '#5c5c5d',
  '800': '#78787a',
  '700': '#9b9b9d',
  '600': '#c7c6c9',
  '500': '#DBDADD',
  '400': '#E2E1E4',
  '300': '#E7E6E8',
  '200': '#eeeeef',
  '100': '#f4f4f4',
  '50': '#fbfbfc',
} as const;

const PINK = {
  '50': '#FFF5F8',
  '75': '#FFD7E1',
  '100': '#FFC7D5',
  '200': '#FFAEC2',
  '300': '#FF9EB6',
  '400': '#B36F7F',
  '500': '#9C606F',
} as const;

const YELLOW = {
  '50': '#FFFCF0',
  '75': '#FFF4C1',
  '100': '#FFEFA7',
  '200': '#FFE882',
  '300': '#FFE368',
  '400': '#B39F49',
  '500': '#9C8A3F',
} as const;

export const COLORS = {
  black: BLACK,
  gray: GRAY,
  yellow: YELLOW,
  pink: PINK,

  // Basic
  white: '#FFFFFF',

  // Text
  text: {
    primary: BLACK[500],
    secondary: '#565656',
    tertiary: '#C1C1C1',
    placeholder: '#9B9B9D',
    kakao: 'rgba(0,0,0,0.85)',
  },

    // Main
  main: {
    normal: PINK['300'],
    point: YELLOW['300'],
    light: '#FFF7EB',
    background: '#FFFDEF',
  },
} as const;
