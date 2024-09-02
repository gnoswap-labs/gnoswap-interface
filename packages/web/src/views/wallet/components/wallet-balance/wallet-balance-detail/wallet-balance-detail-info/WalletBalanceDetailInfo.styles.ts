import styled from "@emotion/styled";
import mixins from "@styles/mixins";
import { fonts } from "@constants/font.constant";
import { media } from "@styles/media";

export const WalletBalanceDetailInfoWrapper = styled.div`
  ${mixins.flexbox("row", "center", "center")};
  width: 100%;
  &:last-of-type {
    min-width: 284px;
    @media (max-width: 1180px) and (min-width: 969px) {
      min-width: 261px;
    }
  }
  .wallet-detail-left-side {
    ${mixins.flexbox("column", "flex-start", "flex-start")};
    width: 100%;
    padding: 23px 35px;
    gap: 16px;
    height: 116px;

    ${media.tablet} {
      padding: 23px;
      height: 118px;
    }
    ${media.tabletMiddle} {
      height: auto;
    }
    @media (max-width: 968px) {
      height: auto;

      ${mixins.flexbox("row", "center", "space-between")};
      padding: 11px;
    }
    ${media.mobile} {
      height: auto;
      ${mixins.flexbox("column", "flex-start", "flex-start")};
      padding: 11px;
      gap: 8px;
    }

    & + & {
      border-left: 1px solid ${({ theme }) => theme.color.border02};
      ${media.tabletMiddle} {
        border-left: none;
      }
    }

    .title-wrapper {
      ${mixins.flexbox("row", "center", "center")};
      gap: 4px;
      flex-shrink: 0;

      .title {
        flex-shrink: 0;
        ${fonts.body12}
        color: ${({ theme }) => theme.color.text04};
      }

      svg {
        cursor: default;
        width: 16px;
        height: 16px;
      }
      path {
        fill: ${({ theme }) => theme.color.icon03};
      }
    }
    .value-wrapper {
      ${mixins.flexbox("row", "center", "flex-start")};
      &:last-of-type {
        ${mixins.flexbox("row", "center", "space-between")};
      }
      width: 100%;
      @media (max-width: 968px) {
        width: auto;
        gap: 8px;
      }
      ${media.mobile} {
        gap: 8px;
      }
      > div {
        ${mixins.flexbox("row", "center", "flex-start")};
      }
      .pule-skeleton {
        display: inline-flex;
      }
      .loading {
        height: 39px;
        ${media.tablet} {
          height: 34px;
        }
        ${media.mobile} {
          height: 31px;
        }
      }
      .value {
        display: inline-flex;
        width: 100%;
        ${fonts.body2};
        font-weight: 500 !important;
        color: ${({ theme }) => theme.color.text02};
        ${media.tablet} {
          ${fonts.body4};
        }
        ${media.mobile} {
          ${fonts.body6};
        }
      }
      .hidden-value {
        opacity: 0;
        visibility: hidden;
        position: absolute;
        z-index: 0;
        max-width: max-content;
      }
      .button-wrapper {
        margin-left: 16px;
        flex-shrink: 0;
      }
    }
  }
  .wallet-detail-right-side {
  padding: 12px;
  }
`;

export const WalletBalanceDetailInfoTooltipContent = styled.div`
  ${mixins.flexbox("column", "flex-start", "flex-start")};
  max-width: 300px;
  ${fonts.body12};
  color: ${({ theme }) => theme.color.text02};
  background-color: ${({ theme }) => theme.color.background02};
  .dark-shadow {
    box-shadow: 8px 8px 20px 0px rgba(0, 0, 0, 0.2);
  }
  .light-shadow {
    box-shadow: 10px 14px 48px 0px rgba(0, 0, 0, 0.12);
  }
`;
