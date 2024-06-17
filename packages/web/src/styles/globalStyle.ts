import { css, type Theme } from "@emotion/react";
import { media } from "./media";

const globalStyle = (theme: Theme) => css`
  html,
  body {
    -webkit-text-size-adjust: none;
    -ms-text-size-adjust: none;
    -moz-text-size-adjust: none;
    -o-text-size-adjust: none;
    padding: 0;
    margin: 0;
    width: 100%;
    min-width: 360px;
    height: 100%;
    font-family: Inter, sans-serif;
    position: fixed;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
  }

  body {
    background-color: ${theme.color.background01};
    padding-top: 70px;
    ${media.tablet} {
      padding-top: 60px;
    }
    ${media.mobile} {
      padding-top: 50px;
    }
  }

  #__next {
    width: 100%;
    height: 100%;
  }

  * {
    box-sizing: border-box;
    font: inherit;
    color: inherit;
  }

  a {
    text-decoration: none;
  }

  select,
  input,
  button,
  textarea {
    background: none;
    border: none;
    outline: none;
    padding: 0;
  }

  button {
    cursor: pointer;
    &:disabled {
      cursor: default;
    }
  }

  div,
  span,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  p,
  a,
  em,
  img,
  b,
  ul,
  li,
  dl,
  dd,
  dt,
  form,
  label,
  footer,
  header,
  nav,
  section,
  input,
  textarea {
    margin: 0;
    padding: 0;
    border: 0;
    outline: none;
    list-style: none;
  }

  ::-webkit-scrollbar {
    width: 0px;
    display: none;
  }

  ::-webkit-scrollbar-track {
    background-color: transparent;
  }

  input[type="number"]::-webkit-outer-spin-button,
  input[type="number"]::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;

export default globalStyle;
