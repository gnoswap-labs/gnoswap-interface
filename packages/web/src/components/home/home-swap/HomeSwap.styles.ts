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
      .skeleton {
        margin-bottom: 6px;
        border-radius: 2px;
      }
    }

    .token {
      cursor: default;
      .token-symbol {
        margin-right: 0;
      }
      > div {
        border: 1px solid transparent;
        transition: border 0.5s ease-in-out;
        &.isChanging {
          border: 1px solid var(--gradient-dark-border-gradient, #536cd7);
        }
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

    .skeleton-small {
      width: 77px;
      height: 16px;

      border-radius: 2px;
      background: linear-gradient(0deg, rgba(20, 26, 41, 0.5) 0%, rgba(20, 26, 41, 0.5) 100%);
      box-shadow: 8px 8px 20px 0px rgba(0, 0, 0, 0.2);
    }

    .price-text,
    .balance-text {
      display: flex;
      align-items: center;
      gap: 4px;
      ${fonts.p1};
      color: ${theme.color.text04};
      &.isChanging {
        animation: fadeInOut 0.5s ease-in-out;
      }
    }
    .price-text {
      flex-shrink: 0;
      max-width: 60%;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .balance-text-disabled {
      z-index: 1;
    }

    .token {
      ${mixins.flexbox("row", "center", "center")}
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
        :hover {
          /* background-color: ${theme.color.backgroundGradient}; */
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
    .swap-button {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      svg {
        width: 24px;
        height: 24px;
      }
    }
  }

  @keyframes fadeInOut {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
`;
