import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";
import mixins from "@styles/mixins";

export const TableColumn = styled.div<{ tdWidth: number }>`
  width: ${({ tdWidth }) => `${tdWidth}px`};
  min-width: ${({ tdWidth }) => `${tdWidth}px`};
  padding: 16px;
  .ellipsis {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
  &:first-of-type {
    padding: 16px 16px 16px 15px;
  }
  &:last-of-type {
    padding: 16px 15px 16px 16px;
  }
  height: 100%;
  color: ${({ theme }) => theme.color.text01};
  ${mixins.flexbox("row", "center", "flex-end")};
  gap: 8px;
  .token-symbol-image {
    width: 24px;
    height: 24px;
  }
  .reward-token-symbol {
    color: ${({ theme }) => theme.color.text05};
    font-size: 14px;
    font-weight: 400;
  }
  .icon-reward {
    width: 20px;
    height: 20px;
  }
  &.left {
    padding: 16px 0 16px 16px;
    flex-shrink: 0;
    justify-content: flex-start;
  }
`;

export const ProjectInfoWrapper = styled.div`
  transition: background-color 0.3s ease;
  min-width: 100%;
  height: 68px;
  ${mixins.flexbox("row", "center", "flex-start")};
  ${fonts.body11};
  &:not(:first-of-type) {
    border-top: 1px solid ${({ theme }) => theme.color.border02};
  }
  &:hover {
    background-color: ${({ theme }) => theme.color.hover04};
  }

  .clickable {
    cursor: pointer;
  }
  .symbol-pair {
    margin: 0px 8px;
  }
  .feeRate {
    ${fonts.body12};
    color: ${({ theme }) => theme.color.text04};
  }

  .icon-reward {
    width: 20px;
    height: 20px;
  }
  .apr {
    ${mixins.flexbox("row", "center", "center")}
  }

  .button-wrapper {
    ${mixins.flexbox("row", "center", "center")}
    gap: 4px;
    color: ${({ theme }) => theme.color.text04};
    font-weight: 400;
    cursor: pointer;
    .svg {
      width: 16px;
      height: 16px;
      font-size: 0;
      * {
        fill: ${({ theme }) =>
          theme.themeKey === "dark" ? "#596782" : "#90A2C0"};
      }
    }

    &,
    svg * {
      transition: all 0.3s ease;
    }

    &:hover {
      color: ${({ theme }) => theme.color.text03};
      svg * {
        fill: ${({ theme }) => theme.color.icon07};
      }
    }
  }
`;
