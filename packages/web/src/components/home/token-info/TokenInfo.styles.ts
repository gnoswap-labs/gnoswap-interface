import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";
import mixins from "@styles/mixins";

export const TokenInfoWrapper = styled.div`
  ${mixins.flexbox("row", "center", "flex-start")};
  height: 68px;
  width: 100%;
  ${fonts.body11};
  &:not(:first-of-type) {
    border-top: 1px solid ${({ theme }) => theme.color.border02};
  }
`;

export const HoverSection = styled.div`
  ${mixins.flexbox("row", "center", "center", false)};
  background-color: ${({ theme }) => theme.color.background01};
  transition: background-color 0.3s ease;
  cursor: pointer;
  height: 100%;
  overflow: hidden;
  &:hover {
    background-color: ${({ theme }) => theme.color.hover04};
  }
`;

export const TableColumn = styled.div<{ tdWidth: number }>`
  width: ${({ tdWidth }) => `${tdWidth}px`};
  min-width: ${({ tdWidth }) => `${tdWidth}px`};
  padding: 16px;
  height: 100%;
  color: ${({ theme }) => theme.color.text01};
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
  &.negative {
    padding-left: 0;
    color: ${({ theme }) => theme.color.green01};
    svg * {
      fill: ${({ theme }) => theme.color.green01};
    }
  }
  &.positive {
    padding-left: 0;
    color: ${({ theme }) => theme.color.red01};
    svg * {
      fill: ${({ theme }) => theme.color.red01};
    }
  }
  &.liquid-col {
    gap: 8px;
  }
  .liquid-symbol {
    margin: 0px;
  }

  &.last7days-graph {
    display: flex;
  }

  .token-logo {
    width: 20px;
    height: 20px;
  }
  .token-name {
    margin: 0px 8px;
  }

  .token-symbol,
  .fee-rate,
  .token-index {
    ${fonts.body12};
    color: ${({ theme }) => theme.color.text04};
  }
`;
