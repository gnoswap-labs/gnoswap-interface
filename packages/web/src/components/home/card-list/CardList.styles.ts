import styled from "@emotion/styled";
import mixins from "@styles/mixins";
import { CSSProperties } from "react";

interface SkeletonStyleProps {
  tdWidth?: CSSProperties["width"];
}

export const CardListWrapper = styled.ul`
  ${mixins.flexbox("column", "center", "flex-start")};
  width: 100%;
  min-height: 120px;
`;


export const SkeletonItem = styled.div<SkeletonStyleProps>`
  width: ${({ tdWidth }) => `${tdWidth}`};
  height: 100%;
  padding: 8px 24px;
  ${mixins.flexbox("row", "center", "flex-start")};
`;
