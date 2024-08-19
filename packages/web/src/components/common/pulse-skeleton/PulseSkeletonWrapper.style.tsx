import styled from "@emotion/styled";

import { media } from "@styles/media";
import mixins from "@styles/mixins";

interface Props {
  height: number;
  mobileHeight: number;
  width?: number;
}

export const PulseSkeletonWrapper = styled.div<Props>`
  max-width: 100%;
  width: ${({ width }) => {
    return width ? `${width}px` : "auto";
  }};
  ${mixins.flexbox("row", "center", "flex-start")}
  height: ${({ height }) => {
    return `${height}px`;
  }};
  ${media.tablet} {
    height: ${({ height }) => {
      return `${height}px`;
    }};
  }
  ${media.mobile} {
    height: ${({ mobileHeight }) => {
      return `${mobileHeight}px`;
    }};
  }
  > span {
    display: block;
    max-width: 100%;
  }
`;
