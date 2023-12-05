import { media } from "@styles/media";
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
    ${theme.color.bgLoading} 0deg,
    #233DBD 360deg
  );

  &::before {
    ${mixins.positionCenter()};
    content: "";
    background-color: ${theme.color.background06};
    width: 60px;
    height: 60px;
    border-radius: 100%;
    box-shadow: ${theme.color.shadow02};
  }
  ${media.mobile} {
    width: 60px;
    height: 60px;
    &::before {
      width: 48px;
      height: 48px;
    }
  }
`;
