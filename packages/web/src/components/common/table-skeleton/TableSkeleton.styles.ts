import styled from "@emotion/styled";
import { media } from "@styles/media";
import mixins from "@styles/mixins";
import { CSSProperties } from "react";
interface SkeletonStyleProps {
  tdWidth?: CSSProperties["width"];
  className?: string;
}

export const SkeletonWrapper = styled.div<SkeletonStyleProps>`
  ${mixins.flexbox("row", "center", "space-between")};
  min-width: 100%;
  height: 68px;
  &:not(:first-of-type) {
    border-top: 1px solid ${({ theme }) => theme.color.border02};
  }
  ${media.mobile} {
    height: 52px;
  }
`;

export const UnLoadingItem = styled.div<SkeletonStyleProps>`
  ${mixins.flexbox("row", "center", "flex-end")};
  width: ${({ tdWidth }) => `${tdWidth}px`};
  height: 100%;
  padding: 16px;
  &.left {
    flex-shrink: 0;
    justify-content: flex-start;
  }
  &.left-padding {
    padding: 16px 16px 16px 0;
  }
  &.right-padding-16 {
    padding: 16px 0 16px 16px;
  }
  &.right-padding-12 {
    padding: 16px 12px 16px 16px;
  }
  &.padding-12 {
    padding: 16px 12px 16px 12px;
  }
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
  &.left-padding {
    padding: 16px 16px 16px 0;
  }
  &.right-padding-16 {
    padding: 16px 0 16px 16px;
  }
  &.right-padding-12 {
    padding: 16px 12px 16px 16px;
  }
  &.padding-12 {
    padding: 16px 12px 16px 12px;
  }
`;
