import { media } from "@styles/media";
import { keyframes } from "@emotion/react";
import mixins from "@styles/mixins";
import styled from "@emotion/styled";

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

export const LoadingSpinnerWrapper = styled.div<{
  container: number;
  circle: number;
  mobileContainer: number;
  mobileCircle: number;
}>`
  position: relative;
  width: ${({ container }) => `${container}px`};
  height: ${({ container }) => `${container}px`};
  border-radius: 100%;
  animation: ${spin} 1s linear infinite;
  background: conic-gradient(
    from 0deg at 50% 50.63%,
    ${({ theme }) => theme.color.bgLoading} 0deg,
    #233dbd 360deg
  );

  &::before {
    ${mixins.positionCenter()};
    content: "";
    background-color: ${({ theme }) => theme.color.background06};
    width: ${({ circle }) => `${circle}px`};
    height: ${({ circle }) => `${circle}px`};
    border-radius: 100%;
    box-shadow: ${({ theme }) => theme.color.shadow02};
  }

  ${media.mobile} {
    width: ${({ mobileContainer }) => `${mobileContainer}px`};
    height: ${({ mobileContainer }) => `${mobileContainer}px`};

    &::before {
      width: ${({ mobileCircle }) => `${mobileCircle}px`};
      height: ${({ mobileCircle }) => `${mobileCircle}px`};
    }
  }
`;
