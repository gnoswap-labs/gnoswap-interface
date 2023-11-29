import mixins from "@styles/mixins";
import { css, Theme } from "@emotion/react";
import { fonts } from "@constants/font.constant";
import { media } from "@styles/media";
import styled from "@emotion/styled";

export const wrapper = (theme: Theme) => css`
  padding: 23px;
  background-color: ${theme.color.background06};
  border: 1px solid ${theme.color.border02};
  box-shadow: 8px 8px 20px 0px rgba(0, 0, 0, 0.08);
  border-radius: 8px;

  .header {
    ${mixins.flexbox("row", "center", "space-between")};
    width: 100%;
    padding-bottom: 16px;

    .title {
      ${fonts.h6};
      color: ${theme.color.text02};
      ${media.mobile} {
        ${fonts.body9}
      }
    }
    .header-button {
      ${mixins.flexbox("row", "center", "center")};
      gap: 15px;
      ${media.mobile} {
        gap: 12px;
      }
    }
    .setting-button {
      width: 24px;
      height: 24px;
    }
    .link-button {
      position: relative;
    }
    .setting-icon * {
      fill: ${theme.color.icon03};
    }
    .setting-icon {
      &:hover {
        * {
          fill: ${theme.color.icon07};
        }
      }
    }
  }

  .loading-change {
    ${mixins.flexbox("row", "center", "flex-start")};
    gap: 8px;
    color: ${theme.color.text03};
    ${fonts.body12}
    > div {
      width: 16px;
      height: 16px;
      &::before {
        width: 12px;
        height: 12px;
      }
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
      width: 100%;
      padding: 16px 24px;
      background-color: ${theme.color.background01};
      border: 1px solid ${theme.color.border02};
      border-radius: 8px;
      &:focus-within {
        border: 1px solid  ${theme.color.border15};
      }
    }

    .amount {
      ${mixins.flexbox("row", "center", "space-between")};
      width: 100%;
      margin-bottom: 8px;
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
        color: ${theme.color.text02};
      }
    }

    .price-text,
    .balance-text {
      ${fonts.p2};
      color: ${theme.color.text10};
    }
    .balance-text-disabled {
      cursor: pointer;
    }

    .token {
      ${mixins.flexbox("row", "center", "center")}
      width: auto;
      border-radius: 36px;
      color: ${theme.color.text01};
      height: 34px;
      .selected-token {
        padding: 5px 10px 5px 6px;
      }
      .not-selected-token {
        padding: 5px 10px 5px 12px
      }
      .token-symbol {
        height: 21px;
      }
    }

    .arrow {
      cursor: pointer;
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
        &:hover {
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

export const CopyTooltip = styled.div`
  ${mixins.flexbox("column", "center", "flex-start")};
  position: absolute;
  top: -65px;
  left: -45px;
  .box {
    ${mixins.flexbox("column", "flex-start", "flex-start")};
    width: 115px;
    padding: 16px;
    gap: 8px;
    flex-shrink: 0;
    border-radius: 8px;
    ${fonts.body12};
    color: ${({ theme }) => theme.color.text02};
    background-color: ${({ theme }) => theme.color.background02};
  }
  .dark-shadow {
    box-shadow: 10px 14px 60px rgba(0, 0, 0, 0.4);
  }
  .light-shadow {
    box-shadow: 10px 14px 48px 0px rgba(0, 0, 0, 0.12);
  }
  .polygon-icon * {
    fill: ${({ theme }) => theme.color.background02};
  }
`;