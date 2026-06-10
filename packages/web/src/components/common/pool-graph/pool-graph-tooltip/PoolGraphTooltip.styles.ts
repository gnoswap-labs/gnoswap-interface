import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";
import { media } from "@styles/media";

export const PoolGraphTooltipContainer = styled.div`
  & {
    display: flex;
    flex-direction: column;
    background-color: ${({ theme }) => theme.color.background02};
    align-items: flex-start;
    border-radius: 8px;
    gap: 8px;
    ${fonts.body12};
    line-height: 1em;

    .price-row {
      display: flex;
      gap: 4px;
      color: ${({ theme }) => theme.color.text02};
      white-space: nowrap;

      .price-value {
        color: ${({ theme }) => theme.color.text02};
      }
    }

    .row {
      display: flex;
      flex-direction: row;
      width: 100%;
      gap: 8px;

      & > span {
        display: flex;
        flex-direction: row;
        align-items: center;

        &.price {
          width: 100%;
          justify-content: flex-end;
        }

        &.price-range {
          justify-content: flex-end;
        }

        &.token-title {
          ${media.mobile} {
            display: none;
          }
        }
      }
    }

    .header {
      display: flex;
      flex-direction: column;
      color: ${({ theme }) => theme.color.text04};
      justify-content: space-between;
      width: 100%;
      padding: 3px 0;

      &.mt-8 {
        margin-top: 8px;
      }
    }

    .content {
      display: flex;
      flex-direction: column;
      color: ${({ theme }) => theme.color.text02};
      gap: 8px;
      width: 100%;

      &.pool-liquidity-content {
        margin-top: 8px;
      }

      .row {
        padding: 4px 0;
      }
    }

    .token {
      flex-shrink: 0;
      min-width: 80px;
      gap: 8px;

      img {
        width: 20px;
        height: 20px;
      }
    }

    .content-token {
      flex-shrink: 0;
      min-width: 80px;
      gap: 8px;

      img {
        width: 20px;
        height: 20px;
      }

      ${media.mobile} {
        min-width: 20px;
        width: 20px;
        .symbol {
          display: none;
        }
      }
    }

    .amount {
      flex-shrink: 0;
      min-width: 76px;

      & .token-amount-value {
        display: inline;
        overflow: hidden;
        text-overflow: clip;
        white-space: nowrap;
        word-break: break-all;
      }

      & .small-font {
        font-size: 10px;
      }

      & .token-price-value {
        color: ${({ theme }) => theme.color.text04};
        margin-left: 4px;
        white-space: nowrap;
      }

      &.w-100 {
        min-width: 108px;
        ${media.mobile} {
          &.in-header {
            padding-left: 30px;
          }
        }
      }

      img {
        width: 20px;
        height: 20px;
        display: none;
      }

      ${media.mobile} {
        &.total-amount {
          width: fit-content;
          gap: 8px;
        }

        img {
          display: block;
        }
      }
    }

    .price-range {
      width: 100%;
      ${media.mobile} {
        font-size: 12px;
      }
    }
    .small-font {
      font-size: 12px;
    }

    ${media.mobile} {
      max-width: max-content;
      max-width: calc(100vw - 24px);
    }

    @media (max-width: 360px) {
      max-width: 336px;
    }
  }
`;
