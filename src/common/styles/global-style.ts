import { createGlobalStyle } from "styled-components";
import { reset } from "styled-reset";

export const GlobalStyle = createGlobalStyle`
  ${reset}
  html{
    -webkit-text-size-adjust: none;
    font-family: Inter, sans-serif;
    font-display: fallback;
    -ms-overflow-style: none;
    scrollbar-width: none;
    letter-spacing: -2%;
  }

  * {
    box-sizing: border-box;
    font: inherit;
    color: inherit;
  };

  a {
    text-decoration: none;
  };

	input {
    background: none;
    outline: none;
    padding: 0;
    border: none;
  };

  button {
    background: none;
    padding: 0;
    border: none;
    cursor: pointer;
    &:disabled {
    cursor: default;
			fill: #f2f3f4;
    }
  }
`;
