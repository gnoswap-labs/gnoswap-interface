import { fonts } from "@constants/font.constant";
import { css, Theme } from "@emotion/react";
import mixins from "@styles/mixins";

export const wrapper = (theme: Theme) => css`
  ${mixins.flexbox("column", "center", "center")};
  width: 100%;
  background-color: ${theme.color.backgroundOpacity};
  border-radius: 8px;
  border: 1px solid ${theme.color.border02};
  padding: 15px;
  gap: 16px;
  cursor: pointer;
  .title-content {
    ${mixins.flexbox("row", "center", "space-between")};
    width: 100%;
    .title {
      color: ${theme.color.text05};
      ${fonts.body12};
    }
    .setting-button {
      width: 24px;
      height: 24px;
    }
    .setting-icon * {
      fill: ${theme.color.icon03};
    }
  }
  .enter-amounts-wrap {
    width: 100%;
  }

  .inputs {
    ${mixins.flexbox("column", "center", "space-between")};
    flex-wrap: wrap;
    gap: 2px;
    width: 100%;
    height: 100%;
    position: relative;
    .from {
      ${mixins.flexbox("row", "center", "space-between")};
      flex-wrap: wrap;

      width: 100%;
      padding: 15px 23px;

      background-color: ${theme.color.background01};
      border: 1px solid ${theme.color.border02};
      border-radius: 8px;
    }

    .to {
      ${mixins.flexbox("row", "center", "space-between")};
      flex-wrap: wrap;

      width: 100%;
      padding: 15px 23px;

      background-color: ${theme.color.background01};
      border: 1px solid ${theme.color.border02};
      border-radius: 8px;
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
      ${fonts.body1};
      color: ${theme.color.text01};
    }

    .price-text,
    .balance-text {
      ${fonts.body12};
      color: ${theme.color.text05};
    }

    .token-badge {
      ${mixins.flexbox("row", "center", "center")};
      height: 32px;
      border: 1px solid green;
      border-radius: 36px;
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

        .add-icon {
          width: 16px;
          height: 16px;
          * {
            fill: ${theme.color.text01};
          }
        }
      }
    }
  }
`;
