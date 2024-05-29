import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";
import { media } from "@styles/media";
import mixins from "@styles/mixins";

export const AssetInfoWrapper = styled.div`
  transition: background-color 0.3s ease;
  cursor: default;
  min-width: 100%;
  height: 68px;
  color: ${({ theme }) => theme.color.text01};
  ${mixins.flexbox("row", "center", "flex-start")};
  ${fonts.body11};
  &:not(:first-of-type) {
    border-top: 1px solid ${({ theme }) => theme.color.border02};
  }
  &:hover {
    background-color: ${({ theme }) => theme.color.hover04};
  }

  .logo {
    width: 24px;
    height: 24px;
  }

  .name {
    margin: 0px 8px;
  }

  .symbol {
    ${fonts.body12};
    color: ${({ theme }) => theme.color.text04};
  }
`;

export const TableColumn = styled.div<{ tdWidth: number }>`
  width: ${({ tdWidth }) => `${tdWidth}px`};
  min-width: ${({ tdWidth }) => `${tdWidth}px`};
  height: 100%;
  ${mixins.flexbox("row", "center", "flex-end")};
  &.pointer {
    cursor: pointer;
  }
  &.left-padding {
    padding: 16px 16px 16px 0;
  }
  .missing-logo {
    ${mixins.flexbox("row", "center", "center")};
    width: 24px;
    height: 24px;
    border-radius: 50%;
    color: ${({ theme }) => theme.color.text02};
    background-color: ${({ theme }) => theme.color.text04};
    ${fonts.p7}
    ${media.mobile} {
      font-size: 8px;
      line-height: 10px;
    }
    margin-left: 15px;
  }
  .logo {
    margin-left: 15px;
  }

  &.name-col {
    ${mixins.flexbox("row", "flex-start", "flex-start")};
    .token-name-symbol-path {
      ${mixins.flexbox("column", "start", "start")}
      margin: 0px 8px;
      
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
          ${mixins.flexbox("row", "flex-start", "flex-start")}
          ${fonts.p6};
          color: ${({ theme }) => theme.color.text04};
          background-color: ${({ theme }) => theme.color.background26};
          padding: 2px 4px;
          gap: 2px;
          border-radius: 4px;
          .path-link-icon {
            width: 10px;
            height: 10px;
            fill: ${({ theme }) => theme.color.text04};
          }
        }
      }
      .token-name {
        ${fonts.body11};
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

  

  .name,
  .chain,
  .amount,
  .balance {
    color: ${({ theme }) => theme.color.text02};
  }
  .chain {
    padding: 16px;
    ${media.tablet} {
      padding: 16px 0px 16px 12px;
    }
  }
  .balance {
    padding: 16px 0;
    ${media.tablet} {
      padding: 16px 0px;
    }
  }
  .amount {
    padding: 16px 0;
    ${media.tablet} {
      padding: 16px 0px;
    }
  }
  &.left {
    flex-shrink: 0;
    justify-content: flex-start;
  }
`;

export const LoadButton = styled.button`
  ${mixins.flexbox("row", "center", "center")};
  color: ${({ theme }) => theme.color.text04};
  gap: 4px;
  &.withdraw-pd {
    padding-right: 16px;
    ${media.mobile} {
      padding-right: 12px;
    }
  }
  &,
  svg * {
    transition: all 0.3s ease;
  }
  svg {
    width: 16px;
    height: 16px;
    * {
      fill: ${({ theme }) => theme.color.icon03};
    }
  }

  &:hover {
    color: ${({ theme }) => theme.color.text03};
    svg * {
      fill: ${({ theme }) => theme.color.icon07};
    }
  }
`;
