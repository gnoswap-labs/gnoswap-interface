import { css, keyframes, Theme } from "@emotion/react";
import mixins from "@styles/mixins";

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

export const wrapper = (theme: Theme) => css`
  position: relative;
  width: 72px;
  height: 72px;
  border-radius: 100%;
  animation: ${spin} 1s linear infinite;
  background: conic-gradient(
    from 0deg at 50% 50.63%,
    #000000 0deg,
    #0059ff 360deg
  );

  &::before {
    ${mixins.positionCenter()};
    content: "";
    background-color: ${theme.color.background06};
    width: 60px;
    height: 60px;
    border-radius: 100%;
    box-shadow: 8px 8px 20px 0px rgba(0, 0, 0, 0.2);
  }
`;
