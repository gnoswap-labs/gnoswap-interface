import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";
import { media } from "@styles/media";
import mixins from "@styles/mixins";

export const TokenAmountInputWrapper = styled.div`
  ${mixins.flexbox("row", "center", "space-between")};
  flex-wrap: wrap;
  width: 100%;
  padding: 16px 24px;

  background-color: ${({ theme }) => theme.color.background20};
  border: 1px solid ${({ theme }) => theme.color.border02};
  border-radius: 8px;
  &:focus-within {
    border: 1px solid ${({ theme }) => theme.color.border15};
  }
  .amount {
    ${mixins.flexbox("row", "center", "space-between")};
    width: 100%;
    margin-bottom: 8px;
  }

  .token {
    height: 32px;
    cursor: default;
    span {
      font-size: 15px;
      line-height: 19px;
    }
  }

  .info {
    ${mixins.flexbox("row", "center", "space-between")};
    width: 100%;
  }

  .amount-text {
    width: 100%;
    ${fonts.body1};
    color: ${({ theme }) => theme.color.text01};
    margin-right: 30px;
    ${media.mobile} {
      ${fonts.body5};
    }
    &::placeholder {
      color: ${({ theme }) => theme.color.text02};
    }
  }

  .price-text,
  .balance-text {
    ${fonts.p2};
    color: ${({ theme }) => theme.color.text04};
    cursor: pointer;
  }
  .disable-pointer {
    cursor: default;
  }
  ${media.mobile} {
    padding: 11px;
    gap: 8px;
    .amount {
      margin-bottom: 0;
    }
    .amount-text {
      line-height: 34px;
    }
  }
`;
