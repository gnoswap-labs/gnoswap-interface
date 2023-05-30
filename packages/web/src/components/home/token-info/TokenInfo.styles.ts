import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";
import mixins from "@styles/mixins";

export const TokenInfoWrapper = styled.div`
  ${mixins.flexbox("row", "center", "flex-start")};
  height: 68px;
  width: 100%;
  ${fonts.body11};
  &:not(:first-of-type) {
    border-top: 1px solid ${({ theme }) => theme.colors.gray50};
  }
`;

export const HoverSection = styled.div`
  ${mixins.flexbox("row", "center", "center", false)};
  background-color: ${({ theme }) => theme.colors.colorBlack};
  transition: background-color 0.3s ease;
  cursor: pointer;
  height: 100%;
  overflow: hidden;
  &:hover {
    background-color: ${({ theme }) => theme.colors.gray60};
  }
`;

export const TableColumn = styled.div<{ tdWidth: number }>`
  width: ${({ tdWidth }) => `${tdWidth}px`};
  min-width: ${({ tdWidth }) => `${tdWidth}px`};
  padding: 16px;
  height: 100%;
  color: ${({ theme }) => theme.colors.colorWhite};
  ${mixins.flexbox("row", "center", "flex-end")};
  &.left {
    flex-shrink: 0;
    justify-content: flex-start;
  }

  &.negative {
    padding-left: 0;
    color: ${({ theme }) => theme.colors.colorGreen};
    svg * {
      fill: ${({ theme }) => theme.colors.colorGreen};
    }
  }
  &.positive {
    padding-left: 0;
    color: ${({ theme }) => theme.colors.colorRed};
    svg * {
      fill: ${({ theme }) => theme.colors.colorRed};
    }
  }

  .liquid-symbol {
    margin: 0px 4px;
  }
  &.dummy-graph {
    span {
      width: 102px;
      height: 36px;
      border: 1px solid green;
    }
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
    color: ${({ theme }) => theme.colors.gray40};
  }
`;
