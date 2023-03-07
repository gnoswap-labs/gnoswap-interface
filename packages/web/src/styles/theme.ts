import { Theme, css } from '@emotion/react';
import { Palette, FontsKeyType } from './theme-type';

export const darkTheme: Palette = {
  colorBlack: '#0A0E17',
  colorWhite: '#FFFFFF',
  colorPoint: '#0059FF',
  colorGreen: '#60E66A',
  colorRed: '#FF503F',
  gray10: '#E0E8F4',
  gray20: '#C3D2EA',
  gray30: '#90A2C0',
  gray40: '#596782',
  gray50: '#596782',
  gray60: '#141A29',
  brand10: '#D2DCFB',
  brand20: '#A7B9F8',
  brand30: '#788FEB',
  brand40: '#536CD7',
  brand50: '#233DBD',
  brand60: '#192EA2',
  brand70: '#112188',
  brand80: '#0B166D',
  brand90: '#060E5A',
  opacityDark05: 'rgba(20, 26, 41, 0.5)',
  opacityDark07: 'rgba(10, 14, 23, 0.7)',
} as const;;

export const lightTheme: Palette = {
  colorBlack: '',
  colorWhite: '',
  colorPoint: '',
  colorGreen: '',
  colorRed: '',
  gray10: '',
  gray20: '',
  gray30: '',
  gray40: '',
  gray50: '',
  gray60: '',
  brand10: '',
  brand20: '',
  brand30: '',
  brand40: '',
  brand50: '',
  brand60: '',
  brand70: '',
  brand80: '',
  brand90: '',
  opacityDark05: '',
  opacityDark07: ''
} as const;;

const fonts: FontsKeyType = {
  h1: css`
    font-size: 60px;
    font-weight: 700;
    line-height: 72px;
  `,
  h2: css`
    font-size: 48px;
    font-weight: 600;
    line-height: 58px;
  `,
  h3: css`
    font-size: 36px;
    font-weight: 600;
    line-height: 44px;
  `,
  h4: css`
    font-size: 32px;
    font-weight: 600;
    line-height: 39px;
  `,
  h5: css`
    font-size: 24px;
    font-weight: 600;
    line-height: 29px;
  `,
  h6: css`
    font-size: 18px;
    font-weight: 600;
    line-height: 22px;
  `,
  body1: css`
    font-size: 28px;
    font-weight: 500;
    line-height: 39px;
  `,
  body2: css`
    font-size: 28px;
    font-weight: 400;
    line-height: 39px;
  `,
  body3: css`
    font-size: 24px;
    font-weight: 500;
    line-height: 34px;
  `,
  body4: css`
    font-size: 24px;
    font-weight: 400;
    line-height: 34px;
  `,
  body5: css`
    font-size: 22px;
    font-weight: 500;
    line-height: 31px;
  `,
  body6: css`
    font-size: 22px;
    font-weight: 400;
    line-height: 31px;
  `,
  body7: css`
    font-size: 18px;
    font-weight: 500;
    line-height: 25px;
  `,
  body8: css`
    font-size: 18px;
    font-weight: 400;
    line-height: 25px;
  `,
  body9: css`
    font-size: 16px;
    font-weight: 500;
    line-height: 21px;
  `,
  body10: css`
    font-size: 16px;
    font-weight: 400;
    line-height: 21px;
  `,
  body11: css`
    font-size: 14px;
    font-weight: 500;
    line-height: 18px;
  `,
  body12: css`
    font-size: 14px;
    font-weight: 400;
    line-height: 18px;
  `,
  p1: css`
    font-size: 13px;
    font-weight: 500;
    line-height: 16px;
  `,
  p2: css`
    font-size: 13px;
    font-weight: 400;
    line-height: 16px;
  `,
  p3: css`
    font-size: 12px;
    font-weight: 500;
    line-height: 15px;
  `,
  p4: css`
    font-size: 12px;
    font-weight: 400;
    line-height: 15px;
  `,
  p5: css`
    font-size: 10px;
    font-weight: 500;
    line-height: 12px;
  `,
  p6: css`
    font-size: 10px;
    font-weight: 400;
    line-height: 12px;
  `,
  p7: css`
    font-size: 9px;
    font-weight: 400;
    line-height: 11px;
  `,
} as const;

const theme: Theme = {
  fonts: fonts,
  colors: {
    darkTheme,
    lightTheme,
  },
};

export default theme;