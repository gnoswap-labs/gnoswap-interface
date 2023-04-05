import styled from "@emotion/styled";
import mixins from "@styles/mixins";
import { CSSProperties } from "react";
interface SkeletonStyleProps {
  tdWidth?: CSSProperties["width"];
}

export const SkeletonWrapper = styled.div<SkeletonStyleProps>`
  ${mixins.flexbox("row", "center", "space-between")};
  min-width: 100%;
  height: 68px;
  &:not(:first-of-type) {
    border-top: 1px solid ${({ theme }) => theme.colors.gray50};
  }
`;

export const UnLoadingItem = styled.div<SkeletonStyleProps>`
  ${mixins.flexbox("row", "center", "flex-end")};
  width: ${({ tdWidth }) => `${tdWidth}px`};
  height: 100%;
  padding: 16px;
`;

export const SkeletonItem = styled.div<SkeletonStyleProps>`
  width: ${({ tdWidth }) => `${tdWidth}px`};
  height: 100%;
  padding: 16px;
  ${mixins.flexbox("row", "center", "flex-end")};
  &.left {
    flex-shrink: 0;
    justify-content: flex-start;
  }
`;
