import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";
import { media } from "@styles/media";
import mixins from "@styles/mixins";

export const TokenInfoWrapper = styled.div`
  ${mixins.flexbox("row", "center", "flex-start")};
  height: 66px;
  width: 100%;
  ${fonts.body11};
  &:not(:first-of-type) {
    border-top: 1px solid ${({ theme }) => theme.color.border02};
  }
`;

export const HoverSection = styled.div`
  ${mixins.flexbox("row", "center", "center", false)};
  transition: background-color 0.3s ease;
  height: 100%;
  &:hover {
    background-color: ${({ theme }) => theme.color.hover04};
  }
`;

export const TableColumn = styled.div<{ tdWidth: number }>`
  width: ${({ tdWidth }) => `${tdWidth}px`};
  min-width: ${({ tdWidth }) => `${tdWidth}px`};
  padding: 16px 0px 16px 16px;

  &:last-child {
    padding: 16px;
  }

  ${media.mobile} {
    padding: 16px 0px 16px 12px;
    &:nth-last-of-type(1) {
      padding: 0px 16px 0px 0px;
    }
  }
  height: 100%;
  color: ${({ theme }) => theme.color.text01};
  ${mixins.flexbox("row", "center", "flex-end")};
  &.left {
    flex-shrink: 0;
    justify-content: flex-start;
    ${media.mobile} {
      padding: 16px 0px 16px 16px;
    }
  }

  .token-index {
    ${mixins.flexbox("row", "center", "flex-start")};
    gap: 4px;
    ${fonts.body11};
    color: ${({ theme }) => theme.color.text02};
  }
  .tooltip-label {
    cursor: default;
  }
  .symbol-text {
    font-weight: 700;
  }
`;

export const IconButton = styled.button`
  ${mixins.flexbox("row", "center", "center")};
  width: 16px;
  height: 16px;
  margin: 1px 0px 1px 2px;
  ${media.tablet} {
    margin-left: 2px;
  }
  ${media.mobile} {
    margin-left: 0;
  }
  svg * {
    fill: ${({ theme }) => theme.color.icon03};
  }
  :hover {
    svg * {
      fill: ${({ theme }) => theme.color.icon07};
    }
  }
`;

export const TableColumnTooltipContent = styled.div`
  max-width: 268px;
  word-break: break-all;
  ${fonts.body12};
`;

export const MobileActivitiesWrapper = styled.div`
  ${mixins.flexbox("row", "center", "flex-start")};
  height: 66px;
  width: 100%;
  ${fonts.body11};
  &:not(:first-of-type) {
    border-top: 1px solid ${({ theme }) => theme.color.border02};
  }
`;

export const MobileTableColumn = styled.div<{ tdWidth: number }>`
  width: ${({ tdWidth }) => `${tdWidth}px`};
  min-width: ${({ tdWidth }) => `${tdWidth}px`};
  padding: 16px;
  ${media.mobile} {
    padding: 16px 0px 16px 12px;
    &:nth-last-of-type(1) {
      padding: 0px 16px 0px 0px;
    }
  }
  height: 100%;
  color: ${({ theme }) => theme.color.text01};
  ${mixins.flexbox("row", "center", "flex-end")};
  &.left {
    flex-shrink: 0;
    justify-content: flex-start;
    ${media.mobile} {
      padding: 16px 0px 16px 16px;
    }
  }

  .cell {
    ${mixins.flexbox("row", "center", "flex-start")};
    gap: 4px;
    ${fonts.body11};
    color: ${({ theme }) => theme.color.text02};

    &.token-amount {
      white-space: nowrap;
    }
  }
  .tooltip-label {
    cursor: default;
  }
  .symbol-text {
    font-weight: 700;
  }
`;
