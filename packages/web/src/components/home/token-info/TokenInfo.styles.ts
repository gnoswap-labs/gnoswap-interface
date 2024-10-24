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
  transition: background-color 0.3s ease;
  cursor: pointer;
  height: 100%;
  overflow: hidden;
  &.disabled-pointer {
    pointer-events: none;
  }
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
  &.positive {
    padding-left: 0;
    color: ${({ theme }) => theme.color.green01};
    svg * {
      fill: ${({ theme }) => theme.color.green01};
    }
    span {
      font-weight: 500;
    }
  }
  &.negative {
    padding-left: 0;
    color: ${({ theme }) => theme.color.red01};
    svg * {
      fill: ${({ theme }) => theme.color.red01};
    }
    span {
      font-weight: 500;
    }
  }
  .liquid-text-wrapper {
    overflow: hidden;
    text-overflow: ellipsis;
    margin-left: 8px;
    text-align: right;
  }
  &.liquid-col {
    gap: 8px;
  }
  .liquid-symbol {
    margin: 0px;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &.last7days-graph {
    display: flex;
  }

  .fee-rate,
  .token-index {
    ${fonts.body12};
    color: ${({ theme }) => theme.color.text04};
  }

  .fee-rate {
    ${fonts.body11};
  }
`;

export const PriceValueWrapper = styled.div`
  background: ${({ theme }) => theme.color.background32};
  padding: 0px 4px;
  border-radius: 4px;
`;
