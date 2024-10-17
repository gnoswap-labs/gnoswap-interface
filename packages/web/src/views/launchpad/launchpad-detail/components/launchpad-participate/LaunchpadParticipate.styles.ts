import styled from "@emotion/styled";
import mixins from "@styles/mixins";
import { media } from "@styles/media";
import { fonts } from "@constants/font.constant";

export const LaunchpadParticipateWrapper = styled.div`
  ${mixins.flexbox("column", "center", "flex-start")}
  gap: 16px;
  width: 100%;
  .participate-header {
    color: ${({ theme }) => theme.color.text02};
    width: 100%;
    font-size: 18px;
    font-weight: 600;
  }
  .participate-input-wrapper {
    ${mixins.flexbox("column", "flex-start", "flex-start")}
    gap: 8px;
    position: relative;
    width: 100%;
    padding: 16px 24px;
    align-self: stretch;
    border-radius: 8px;
    border: 1px solid ${({ theme }) => theme.color.border02};
    background: ${({ theme }) => theme.color.background20};
    &:focus-within {
      border: 1px solid ${({ theme }) => theme.color.border15};
    }
    ${media.mobile} {
      padding: 12px;
    }
  }
  .participate-input-amount {
    ${mixins.flexbox("row", "center", "space-between")};
    width: 100%;
    align-self: stretch;
    color: ${({ theme }) => theme.color.text02};
  }
  .participate-amount-text {
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
  .participate-token-selector {
    display: block;
    height: 32px;
  }
  .participate-amount-info {
    ${mixins.flexbox("row", "center", "space-between")};
    width: 100%;
    align-self: stretch;
    .participate-price-text,
    .participate-balance-text {
      ${fonts.body12};
      ${media.mobile} {
        ${fonts.p2};
      }
      color: ${({ theme }) => theme.color.text04};
    }
  }
  .participate-info-wrapper {
    ${mixins.flexbox("column", "center", "center")};
    gap: 16px;
    width: 100%;
  }
  .participate-info {
    ${mixins.flexbox("row", "center", "space-between")};
    width: 100%;
    .participate-info-key {
      ${mixins.flexbox("row", "center", "center")};
      gap: 4px;
      color: ${({ theme }) => theme.color.text04};
      font-size: 14px;
      font-weight: 400;
    }
    .participate-info-value {
      color: ${({ theme }) => theme.color.text03};
      font-size: 14px;
      font-weight: 400;
    }
  }
  .participate-button-wrapper {
    ${mixins.flexbox("row", "flex-start", "flex-start")};
    position: relative;
    width: 100%;
    button {
      cursor: default;
      height: 57px;
    }
    .button-deposit {
      cursor: pointer;
    }
    span {
      ${fonts.body7}
    }
    ${media.mobile} {
      height: 41px;
      span {
        ${fonts.body9}
      }
    }
  }
`;
