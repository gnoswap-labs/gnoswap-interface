import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";
import { media } from "@styles/media";
import mixins from "@styles/mixins";

export const TokenInfoWrapper = styled.div`
  ${mixins.flexbox("row", "center", "flex-start")};
  height: 52px;
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
  width: 100%;
  height: 100%;
  overflow: hidden;
  &:hover {
    background-color: ${({ theme }) => theme.color.hover04};
  }
  ${media.mobile} {
    ${mixins.flexbox("row", "center", "space-between")};
    padding: 9px 0 9px 16px;
    &:nth-last-of-type(1) {
      padding: 9px 16px 9px 16px;
    }
  }
`;

export const TableColumn = styled.div<{ tdWidth: number }>`
  width: ${({ tdWidth }) => `${tdWidth}px`};
  min-width: ${({ tdWidth }) => `${tdWidth}px`};
  height: 100%;
  color: ${({ theme }) => theme.color.text01};
  ${mixins.flexbox("row", "center", "flex-end")};
  &.left {
    width: 148px;
    flex-shrink: 0;
    justify-content: flex-start;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .positive {
    padding-left: 0;
    color: ${({ theme }) => theme.color.green01};
    svg * {
      fill: ${({ theme }) => theme.color.green01};
    }
    span {
      font-weight: 500;
    }
  }
  .negative {
    padding-left: 0;
    color: ${({ theme }) => theme.color.red01};
    svg * {
      fill: ${({ theme }) => theme.color.red01};
    }
    span {
      font-weight: 500;
    }
  }
  .symbol-col {
    ${mixins.flexbox("column", "flex-start", "flex-start")};
  }

  &.price-col {
    ${mixins.flexbox("column", "flex-end", "center")};
    > div {
      ${mixins.flexbox("row", "center", "center")};
      ${fonts.p4}
      svg {
        width: 16px;
        height: 16px;
      }
      &.positive {
        padding-left: 0;
        color: ${({ theme }) => theme.color.green01};
        svg * {
          fill: ${({ theme }) => theme.color.green01};
        }
      }
    }
  }
  .liquid-symbol {
    margin: 0px 4px;
  }

  &.last7days-graph {
    display: flex;
    padding: 16px;
  }

  .token-logo {
    width: 24px;
    height: 24px;
  }
  .token-name {
    margin: 0px 8px;
    ${fonts.body11};
  }
  .token-symbol {
    margin: 0px 8px;
    ${fonts.p3};
    color: ${({ theme }) => theme.color.text04};
  }

  .token-index {
    padding: 0px 16px 0px 8px;
  }

  .fee-rate,
  .token-index {
    ${fonts.p4};
    color: ${({ theme }) => theme.color.text04};
  }
`;
