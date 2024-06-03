import mixins from "@styles/mixins";
import { css, Theme } from "@emotion/react";
import { fonts } from "@constants/font.constant";

export const wrapper = (theme: Theme) => css`
  width: 480px;
  padding: 15px 23px;
  background-color: ${theme.color.background06};
  border: 1px solid ${theme.color.border02};
  box-shadow: 8px 8px 20px 0px rgba(0, 0, 0, 0.08);
  border-radius: 8px;

  .header {
    ${mixins.flexbox("row", "center", "space-between")};
    width: 100%;
    padding-bottom: 15px;

    .title {
      ${fonts.h6};
      color: ${theme.color.text02};
    }

    .setting-button {
      width: 24px;
      height: 24px;
    }
    .setting-icon * {
      fill: ${theme.color.icon03};
    }
  }

  .inputs {
    ${mixins.flexbox("column", "center", "space-between")};
    flex-wrap: wrap;
    gap: 2px;
    width: 100%;
    height: 100%;
    position: relative;
    
    .from,
    .to {
      ${mixins.flexbox("row", "center", "space-between")};
      flex-wrap: wrap;
      &:focus-within {
        border: 1px solid ${theme.color.border15};
      }
      width: 100%;
      padding: 9px 23px;

      background-color: ${theme.color.background20};
      border: 1px solid ${theme.color.border02};
      border-radius: 8px;
    }

    .amount {
      ${mixins.flexbox("row", "center", "space-between")};
      width: 100%;
      margin-bottom: 5px;
    }

    .token {
      cursor: default;
      .token-symbol {
        margin-right: 0;
      }
      > div {
        padding: 5px 6px 5px 6px;
        height: 34px;
      }
      span {
        font-size: 16px;
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
      font-size: 27px;
      line-height: 38px;
      color: ${theme.color.text01};
      margin-right: 30px;
      &::placeholder {
        color: ${theme.color.text01};
      }
    }

    .price-text,
    .balance-text {
      ${fonts.p1};
      color: ${theme.color.text04};
    }
    .balance-text-disabled {
      cursor: pointer;
      z-index: 1;
    }

    .token {
      ${mixins.flexbox("row", "center", "center")}
      width: 112px;
      height: 30px;
      font-size: 15px;
      font-weight: 500;
      line-height: 19px;
      border-radius: 36px;
      color: ${theme.color.text01};
    }

    .arrow {
      ${mixins.flexbox("row", "center", "center")};
      ${mixins.positionCenter()};
      width: 100%;
      .shape {
        ${mixins.flexbox("row", "center", "center")};
        width: 40px;
        height: 40px;
        background-color: ${theme.color.background01};
        border: 1px solid ${theme.color.border02};
        border-radius: 50%;
        cursor: pointer;
        :hover {
          background-color: ${theme.color.backgroundGradient};
        }
        .shape-icon {
          width: 16px;
          height: 16px;
          * {
            fill: ${theme.color.icon02};
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
