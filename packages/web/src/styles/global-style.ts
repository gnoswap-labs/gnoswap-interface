import { ThemeState } from "@/states";
import { css, ThemeProvider, Global } from "@emotion/react";
import { useRecoilValue } from "recoil";
import theme, { darkTheme, lightTheme } from "./theme";

const globalStyle = css`
  html {
    -webkit-text-size-adjust: none;
    -ms-text-size-adjust: none;
    -moz-text-size-adjust: none;
    -o-text-size-adjust: none;
  }

  body {
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
`;

export default globalStyle;
