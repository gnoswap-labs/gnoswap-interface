import mixins from "@styles/mixins";
import { fonts } from "@constants/font.constant";
import { css, Theme } from "@emotion/react";
import { media } from "@styles/media";

export const wrapper = (theme: Theme) => css`
  width: 100%;
  .title-container {
    flex-wrap: wrap;
    position: relative;
    width: 100%;
    max-width: 1440px;
    margin: 100px auto 0;
    padding: 0 40px;
    > div {
      width: max-content;
      position: relative;
    }
    .title {
      ${fonts.h3};
      color: ${theme.color.text02};
      @media (max-width: 1180px) {
        ${fonts.h4};
      }
      @media (max-width: 768px) {
        ${fonts.h5};
      }
    }
    @media (max-width: 1180px) {
      margin-top: 60px;
    }
    ${media.mobile} {
      margin-top: 24px;
      padding-left: 16px;
    }
    .breadcrumbs {
      position: absolute;
      width: max-content;
      height: max-content;
      left: calc(100% + 20px);
      top: 12px;
      bottom: 6px;
      @media (max-width: 1180px) {
        left: calc(100% + 12px);
        top: 10px;
        bottom: 5px;
      }
      ${media.mobile} {
        left: calc(100% + 10px);
        top: 3px;
        bottom: 2px;
      }
    }
  }

  .main-container {
    ${mixins.flexbox("row", "flex-start", "space-between")};

    gap: 24px;

    max-width: 1440px;
    margin: 36px auto 100px;
    padding: 0 40px;

    @media (max-width: 1180px) {
      gap: 16px;
      margin-top: 24px;
    }
    @media (max-width: 930px) {
      ${mixins.flexbox("column", "flex-start", "flex-start")};
    }
    ${media.mobile} {
      margin-top: 24px;
      padding: 0 16px;
    }
    .main-section {
      ${mixins.flexbox("column", "center", "space-between")};
      gap: 24px;
      flex: 1;
      max-width: 836px;
      min-width: 644px;
      @media (max-width: 1180px) {
        gap: 16px;
        max-width: 654px;
        min-width: 488px;
      }
      @media (max-width: 930px) {
        max-width: 100%;
        min-width: auto;
      }
      .chart {
        width: 100%;
      }

      .info {
        width: 100%;
      }

      .description {
        width: 100%;
      }
      .swap-tablet {
        display: none;
      }
      @media (max-width: 930px ) and (min-width: 769px){
        .swap-tablet {
          position: relative;
          display: initial;
          width: 100%;
          .inputs {
            .amount-text {
              ${fonts.body1}
            }
            .price-text,
            .balance-text {
              ${fonts.body12}
            }
            .token-symbol {
              ${fonts.body9}
            }
          }
          .swap-setting-class {
            top: 50px;
          }
        }
      }
      ${media.mobile} {
        gap: 16px;
        .swap-tablet {
          position: relative;
          display: none;
          width: 100%;
          .inputs {
            .amount-text {
              ${fonts.body5}
            }
            .token-symbol {
              ${fonts.body9}
            }
          }
          .swap-setting-class {
            top: 50px;
          }
        }
      }
      
    }

    .right-section {
      ${mixins.flexbox("column", "center", "space-between")};
      gap: 24px;

      max-width: 500px;

      .swap {
        position: relative;
        width: 100%;
        .inputs {
          .amount-text {
            ${fonts.body1}
          }
          .price-text,
          .balance-text {
            ${fonts.body12}
          }
          .token-symbol {
            ${fonts.body9}
          }
        }
        .swap-setting-class {
          top: 50px;
        }
      }

      .best-pools {
        width: 100%;
      }

      .trending {
        width: 100%;
      }

      .gainers-losers {
        width: 100%;
      }
      @media (max-width: 1180px) {
        max-width: 430px;
        min-width: 346px;
        gap: 16px;
      }
      @media (max-width: 930px) {
        width: 100%;
        max-width: 100%;
        min-width: auto;
        .swap {
          display: none;
        }
      }
    }
  }
`;
