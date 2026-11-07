import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";
import { media } from "@styles/media";
import mixins from "@styles/mixins";

export const LimitPriceControl = styled.div`
  ${mixins.flexbox("row", "center", "space-between")};
  width: 100%;
  gap: 8px;

  .step-button {
    ${mixins.flexbox("row", "center", "center")};
    flex-shrink: 0;
    width: 24px;
    height: 24px;
    border-radius: 4px;
    background-color: ${({ theme }) => theme.color.background13};
    cursor: pointer;
    svg {
      width: 16px;
      height: 16px;
      * {
        fill: ${({ theme }) => theme.color.icon02};
      }
    }
    &:hover svg * {
      fill: ${({ theme }) => theme.color.icon07};
    }
    &:disabled {
      cursor: default;
      opacity: 0.5;
    }
  }

  .price-input {
    width: 100%;
    min-width: 0;
    text-align: center;
    ${fonts.body3};
    color: ${({ theme }) => theme.color.text01};
    background: transparent;
    ${media.mobile} {
      ${fonts.body7};
    }
  }
`;

export const LimitPricePresets = styled.div`
  ${mixins.flexbox("row", "center", "center")};
  flex-wrap: wrap;
  width: 100%;
  gap: 4px;

  .preset-button {
    padding: 2px 8px;
    border-radius: 36px;
    ${fonts.p6};
    color: ${({ theme }) => theme.color.text10};
    background-color: ${({ theme }) => theme.color.background13};
    cursor: pointer;
    &:hover:not(:disabled) {
      color: ${({ theme }) => theme.color.text02};
    }
    &:disabled {
      cursor: default;
      opacity: 0.5;
    }
  }
`;
