import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";
import { media } from "@styles/media";
import mixins from "@styles/mixins";
import { OrderField } from "../../order-form/OrderForm.styles";

export const LimitPriceField = styled(OrderField)`
  width: 100%;
  gap: 12px;
  padding: 16px 23px;

  .sell-when {
    ${fonts.body12};
    color: ${({ theme }) => theme.color.text02};
  }

  .sell-token {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    vertical-align: middle;
    white-space: nowrap;
  }

  ${media.mobile} {
    padding: 12px;
  }
`;

export const LimitPriceControl = styled.div`
  ${mixins.flexbox("row", "center", "space-between")};
  width: 100%;
  gap: 8px;

  .price-quote {
    display: flex;
    flex: 1;
    flex-wrap: wrap;
    align-items: baseline;
    gap: 6px;
    min-width: 0;
  }

  .price-usd {
    ${fonts.body12};
    color: ${({ theme }) => theme.color.text04};
    flex-shrink: 0;
    max-width: 45%;
    overflow-wrap: anywhere;
  }

  .price-input {
    width: auto;
    max-width: 100%;
    min-width: 0;
    field-sizing: content;
    text-align: left;
    ${fonts.body3};
    color: ${({ theme }) => theme.color.text01};
    background: transparent;
    ${media.mobile} {
      ${fonts.body7};
    }
  }

  .quote-token {
    ${fonts.body9};
    color: ${({ theme }) => theme.color.text04};
    flex-shrink: 0;
    white-space: nowrap;
  }
  .step-button {
    ${mixins.flexbox("row", "center", "center")};
    flex-shrink: 0;
    width: 28px;
    height: 28px;
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
  .price-steps {
    display: flex;
    flex-shrink: 0;
    gap: 4px;
  }
`;

export const LimitPricePresets = styled.div`
  ${mixins.flexbox("row", "center", "space-between")};
  width: 100%;
  flex-wrap: wrap;
  gap: 8px;

  .market-price {
    ${fonts.p4};
    color: ${({ theme }) => theme.color.text04};
    max-width: 100%;
    overflow-wrap: anywhere;
    ${media.mobile} {
      ${fonts.p6};
    }
  }

  .preset-buttons {
    display: flex;
    flex-shrink: 0;
    flex-wrap: wrap;
    justify-content: flex-end;
    max-width: 100%;
    margin-left: auto;
    gap: 4px;
  }

  .preset-button {
    padding: 4px 6px;
    border-radius: 4px;
    ${fonts.p4};
    color: ${({ theme }) => theme.color.text10};
    background-color: ${({ theme }) => theme.color.background13};
    cursor: pointer;
    &:hover:not(:disabled) {
      color: ${({ theme }) => theme.color.text02};
    }
    &[aria-pressed="true"] {
      background-color: ${({ theme }) => theme.color.select};
      color: ${({ theme }) => theme.color.text02};
      box-shadow: inset 0 0 0 1px ${({ theme }) => theme.color.border15};
    }
    &:disabled {
      cursor: default;
      opacity: 0.5;
    }
  }
`;

export const LimitPriceWarningWrapper = styled.div`
  width: 100%;
  margin-top: 8px;

  > div {
    padding: 8px 12px;
    ${fonts.body12};
  }
`;
