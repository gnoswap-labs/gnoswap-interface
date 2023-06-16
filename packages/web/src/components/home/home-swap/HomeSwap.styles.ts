import mixins from "@styles/mixins";
import { css, Theme } from "@emotion/react";
import { fonts } from "@constants/font.constant";

export const wrapper = (theme: Theme) => css`
  padding: 15px 23px;
  background-color: ${theme.colors.gray60};
  border: 1px solid ${theme.colors.gray50};
  box-shadow: 10px 14px 60px rgba(0, 0, 0, 0.4);
  border-radius: 8px;

  .header {
    ${mixins.flexbox("row", "center", "space-between")};
    width: 100%;
    padding-bottom: 15px;

    .title {
      ${fonts.h6};
      color: ${theme.colors.gray10};
    }

    .setting-button {
      width: 24px;
      height: 24px;
    }
    .setting-icon * {
      fill: ${theme.colors.gray40};
    }
  }

  .inputs {
    ${mixins.flexbox("column", "center", "space-between")};
    flex-wrap: wrap;
    gap: 5px;
    width: 100%;
    height: 100%;
    position: relative;
    .from,
    .to {
      ${mixins.flexbox("row", "center", "space-between")};
      flex-wrap: wrap;

      width: 100%;
      padding: 9px 23px;

      background-color: ${theme.colors.colorBlack};
      border: 1px solid ${theme.colors.gray50};
      border-radius: 8px;
    }

    .amount {
      ${mixins.flexbox("row", "center", "space-between")};
      width: 100%;
      margin-bottom: 5px;
    }

    .token {
      width: 112px;
      height: 30px;
      cursor: default;
      span {
        font-size: 15px;
        line-height: 19px;
        margin: 0px 8px;
      }
    }

    .info {
      ${mixins.flexbox("row", "center", "space-between")};
      width: 100%;
    }

    .amount-text {
      width: 100%;
      ${fonts.body1};
      font-size: 27px;
      line-height: 38px;
      color: ${theme.colors.colorWhite};
      margin-right: 30px;
    }

    .price-text,
    .balence-text {
      ${fonts.p2};
      color: ${theme.colors.gray30};
    }

    .token {
      ${mixins.flexbox("row", "center", "center")}
      width: 112px;
      height: 30px;
      font-size: 15px;
      font-weight: 500;
      line-height: 19px;
      border-radius: 36px;
      color: ${theme.colors.colorWhite};
    }

    .arrow {
      ${mixins.flexbox("row", "center", "center")};
      ${mixins.positionCenter()};
      width: 100%;
      .shape {
        ${mixins.flexbox("row", "center", "center")};
        width: 40px;
        height: 40px;
        background-color: ${theme.colors.colorBlack};
        border: 1px solid ${theme.colors.gray50};
        border-radius: 50%;

        .shape-icon {
          width: 16px;
          height: 16px;
          * {
            fill: ${theme.colors.gray20};
          }
        }
      }
    }
  }

  .footer {
    ${mixins.flexbox("row", "center", "space-between")};
    width: 100%;
    padding-top: 16px;
  }
`;
