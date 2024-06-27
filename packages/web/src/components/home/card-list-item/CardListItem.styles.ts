import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";
import { UpDownType } from "@models/common/card-list-item-info";
import { media } from "@styles/media";
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

export const ListItem = styled.li<{ upDown: UpDownType, disabled?: boolean }>`
  cursor: ${({ disabled }) => disabled ? "default" : "pointer"};
  ${mixins.flexbox("row", "center", "flex-start")};
  ${fonts.body11};
  width: 100%;
  height: 40px;
  padding: 8px 24px;
  ${media.tablet} {
    padding: 8px 16px;
  }
  transition: background-color 0.3s ease;
  color: ${({ theme }) => theme.color.text01};
  &:hover {
    background-color: ${({ theme }) => theme.color.hover02};
  }

  .list-logo {
    width: 20px;
    height: 20px;
    border-radius: 50%;
  }
  .index,
  .list-content {
    color: ${({ theme }) => theme.color.text04};
  }
  .index {
    display: inline-flex;
    flex-shrink: 0;
    width: 10px;
    height: 20px;
    margin-right: 21px;
    justify-content: flex-start;
    align-items: center;
  }
  .token-name {
    margin: 0px 8px;
  }
  .list-content {
    margin-right: auto;
  }
  .arrow-up * {
    fill: ${({ theme }) => theme.color.green01};
  }
  .arrow-down * {
    fill: ${({ theme }) => theme.color.red01};
  }
  .key-stats-label {
    ${fonts.body12}
    color: #596782;
  }
  .notation-value {
    &.apr-value {
      margin-left: 4px;
    }
    font-weight: 700;
    color: ${({ theme, upDown }) => {
    if (upDown === "up") return theme.color.green01;
    if (upDown === "down") return theme.color.red01;
    return theme.color.text01;
  }};
  }
`;

export const SkeletonItem = styled.div<SkeletonStyleProps>`
  width: ${({ tdWidth }) => `${tdWidth}`};
  height: 100%;
  padding: 8px 24px;
  ${mixins.flexbox("row", "center", "flex-start")};
`;
