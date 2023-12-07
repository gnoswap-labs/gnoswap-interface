import styled from "@emotion/styled";
import mixins from "@styles/mixins";
import { fonts } from "@constants/font.constant";
import { media } from "@styles/media";

export const TokenChartInfoWrapper = styled.div`
  ${mixins.flexbox("column", "flex-start", "flex-start")};

  .token-info-wrapper {
    ${mixins.flexbox("row", "flex-start", "space-between")};
    width: 100%;

    .token-info {
      ${mixins.flexbox("row", "center", "flex-start")};
      gap: 8px;
      > div {
        ${mixins.flexbox("row", "center", "flex-start")};
        gap: 8px;
      }
      .token-image {
        width: 36px;
        height: 36px;
      }
      .token-name {
        color: ${({ theme }) => theme.color.text02};
        ${fonts.body3};
      }

      .token-symbol {
        color: ${({ theme }) => theme.color.text04};
        ${fonts.body6};
      }
    }

    .price-info {
      text-align: right;
      .price {
        color: ${({ theme }) => theme.color.text01};
        ${fonts.body1};
      }
    }
    ${media.mobile} {
      .token-info {
        ${mixins.flexbox("row", "flex-start", "flex-start")};
        gap: 6px;
        > div {
          ${mixins.flexbox("column", "flex-start", "flex-start")};
          gap: 2px;
        }
        .token-name {
          ${media.mobile} {
            ${fonts.body5};
          }
        }
        .token-symbol {
          ${media.mobile} {
            ${fonts.body12};
          }
        }
      }
      .price-info {
        .price {
          ${fonts.body5};
        }
      }
    }
  }
  .change-rate-wrapper {
    ${mixins.flexbox("row", "center", "flex-end")};
    width: 100%;
    ${fonts.body10};

    &.up {
      & * {
        color: ${({ theme }) => theme.color.green01};
        fill: ${({ theme }) => theme.color.green01};
      }
    }

    &.down {
      & * {
        color: ${({ theme }) => theme.color.red01};
        fill: ${({ theme }) => theme.color.red01};
      }
    }
    ${media.mobile} {
      ${fonts.body12};
    }
  }
  
`;
