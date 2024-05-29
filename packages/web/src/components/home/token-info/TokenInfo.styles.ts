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
  &.liquid-col {
    gap: 8px;
  }
  .liquid-symbol {
    margin: 0px;
  }

  &.last7days-graph {
    display: flex;
  }
  
  &.name-col {
    ${mixins.flexbox("row", "flex-start", "flex-start")};
    .token-name-symbol-path {
      ${mixins.flexbox("column", "start", "start")}
      margin: 0px 8px;
      gap: 2px;
      
      .token-name-path {
        ${mixins.flexbox("row", "baseline", "start")}
        gap: 8px;

        .token-path {
          &:hover {
            color: ${({ theme }) => theme.color.text03};
            .path-link-icon {
              path {
                fill: ${({ theme }) => theme.color.text03};
              }
            }
          }
          ${mixins.flexbox("row", "center", "flex-start")}
          ${fonts.p6};
          color: ${({ theme }) => theme.color.text04};
          background-color: ${({ theme }) => theme.color.background26};
          padding: 2px 4px;
          gap: 2px;
          border-radius: 4px;
          white-space: nowrap;

          .path-link-icon {
            width: 10px;
            height: 10px;
            fill: ${({ theme }) => theme.color.text04};
          }
        }
      }
      .token-name {
        font-size: 15px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      },
      .token-symbol {
        ${fonts.p4};
        color: ${({ theme }) => theme.color.text04};
      }
    }
  }

  .token-logo {
    width: 28px;
    height: 28px;
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
