import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";
import { PriceImpactStatus } from "@hooks/swap/data/use-swap-handler";
import { media } from "@styles/media";
import mixins from "@styles/mixins";

export const ContentWrapper = styled.div`
  ${mixins.flexbox("column", "flex-start", "flex-start")};
  width: 100%;
  gap: 2px;
  align-self: stretch;

  .first-section {
    ${mixins.flexbox("column", "flex-start", "flex-start")};
    position: relative;
    width: 100%;
    padding: 15px 23px;
    gap: 8px;
    align-self: stretch;
    border-radius: 8px;
    border: 1px solid ${({ theme }) => theme.color.border02};
    background: ${({ theme }) => theme.color.background20};
    &:focus-within {
      border: 1px solid ${({ theme }) => theme.color.border15};
    }
    ${media.mobile} {
      padding: 11px;
    }
  }

  .amount-container {
    ${mixins.flexbox("row", "center", "space-between")};
    width: 100%;
    align-self: stretch;
    color: ${({ theme }) => theme.color.text02};
  }

  .text-opacity {
    opacity: 0.5;
  }
  .amount-text {
    width: 100%;
    ${fonts.body1};
    ${media.mobile} {
      ${fonts.body5};
    }
    color: ${({ theme }) => theme.color.text01};
    &::placeholder {
      color: ${({ theme }) => theme.color.text01};
    }
  }

  .token-selector {
    display: block;
    height: 34px;
    .selected-token {
      padding: 5px 10px 5px 6px;
    }
    .not-selected-token {
      padding: 5px 10px 5px 12px;
      white-space: nowrap;
      & > span {
      }
    }
    .token-symbol {
      height: 21px;
    }
  }

  .amount-info {
    ${mixins.flexbox("row", "center", "space-between")};
    width: 100%;
    align-self: stretch;
    .balance-wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 4px;
      .balance-max-button {
        padding: 4px 6px;
        border-radius: 36px;
        background: rgba(0, 89, 255, 0.2);
        font-size: 12px;
        font-weight: 500;
        color: #007aff;
        cursor: pointer;
        &:hover {
          background: ${({ theme }) => (theme.themeKey === "dark" ? "rgba(0, 89, 255, 0.1)" : "rgba(0, 89, 255, 0.3)")};
        }
      }
    }

    .price-text,
    .balance-text {
      flex-shrink: 0;
      ${fonts.body12};
      ${media.mobile} {
        ${fonts.p2};
      }
      color: ${({ theme }) => theme.color.text04};
    }
    .price-text {
      flex-shrink: 0;
      max-width: 60%;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .second-price-text {
      max-width: 100%;
    }
    .balance-text-disabled {
    }
  }

  .second-section {
    ${mixins.flexbox("column", "flex-start", "flex-start")};
    padding: 15px 23px;
    gap: 8px;
    align-self: stretch;
    border-radius: 8px;
    background: ${({ theme }) => theme.color.background20};
    border: 1px solid ${({ theme }) => theme.color.border02};
    &:focus-within {
      border: 1px solid ${({ theme }) => theme.color.border15};
    }
    ${media.mobile} {
      padding: 11px;
    }
  }
  .arrow {
    ${mixins.flexbox("row", "center", "center")};
    position: absolute;
    left: 50%;
    top: 100%;
    transform: translate(-50%, -50%);

    width: 100%;
    .shape {
      ${mixins.flexbox("row", "center", "center")};
      width: 40px;
      height: 40px;
      background-color: ${({ theme }) => theme.color.background01};
      border: 1px solid ${({ theme }) => theme.color.border02};
      border-radius: 50%;
      cursor: pointer;
      :hover {
        background-color: ${({ theme }) => theme.color.backgroundGradient};
      }
      .shape-icon {
        width: 16px;
        height: 16px;
        * {
          fill: ${({ theme }) => theme.color.icon02};
        }
      }
    }
  }
`;

export const SwapDivider = styled.div`
  ${mixins.flexbox("column", "flex-start", "flex-start")};
  width: 100%;
  height: 1px;
  align-self: stretch;
  background: ${({ theme }) => theme.color.border02};
`;

export const SelectPairButton = styled.div`
  ${mixins.flexbox("row", "center", "flex-start")};
  padding: 4px 6px;
  gap: 8px;
  border-radius: 36px;
  cursor: pointer;
  background-color: ${({ theme }) => theme.color.background05};
  transition: 0.2s;
  &:hover {
    background-color: ${({ theme }) => theme.color.hover01};
  }
  span {
    ${fonts.body9};
    color: ${({ theme }) => theme.color.text01};
  }
  .token-logo {
    width: 24px;
    height: 24px;
  }
  .arrow-icon {
    width: 16px;
    height: 16px;
    * {
      fill: ${({ theme }) => theme.color.icon01};
    }
  }
`;

export const PriceInfoWrapper = styled.div`
  ${mixins.flexbox("row", "center", "flex-start")};
  width: 100%;
  overflow: hidden;
`;

export const PriceImpactWrapper = styled.div<{
  priceImpact?: PriceImpactStatus;
}>`
  ${mixins.flexbox("row", "center", "flex-start")}
  gap: 4px;
  ${fonts.body12};
  ${media.mobile} {
    ${fonts.p2};
  }
  ${({ priceImpact, theme }) => {
    switch (priceImpact) {
      case "HIGH":
        return `color: ${theme.color.red01};`;
      case "LOW":
        return `color: ${theme.color.text04};`;
      case "POSITIVE":
        return `color: ${theme.color.green01};`;
      case "MEDIUM":
        return `color: ${theme.color.goldenrod};`;
      default:
        return `color: ${theme.color.text04};`;
    }
  }}
  margin-left: 8px;
`;

export const SwapDetailSectionWrapper = styled.div`
  width: 100%;
`;
