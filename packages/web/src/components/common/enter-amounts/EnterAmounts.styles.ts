import { fonts } from "@constants/font.constant";
import { css, Theme } from "@emotion/react";
import styled from "@emotion/styled";
import mixins from "@styles/mixins";

export const wrapper = (theme: Theme) => css`
  ${mixins.flexbox("column", "center", "center")};
  width: 100%;
  background-color: ${theme.colors.opacityDark07};
  border-radius: 8px;
  border: 1px solid ${theme.colors.gray50};
  padding: 15px;
  gap: 16px;
  cursor: pointer;
  .title-content {
    ${mixins.flexbox("row", "center", "space-between")};
    width: 100%;
    .title {
      color: ${theme.colors.gray30};
      ${fonts.body12};
    }
    .setting-button {
      width: 24px;
      height: 24px;
    }
    .setting-icon * {
      fill: ${theme.colors.gray40};
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

      background-color: ${theme.colors.colorBlack};
      border: 1px solid ${theme.colors.gray50};
      border-radius: 8px;
    }

    .to {
      ${mixins.flexbox("row", "center", "space-between")};
      flex-wrap: wrap;

      width: 100%;
      padding: 15px 23px;

      background-color: ${theme.colors.colorBlack};
      border: 1px solid ${theme.colors.gray50};
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
      color: ${theme.colors.colorWhite};
    }

    .price-text,
    .balence-text {
      ${fonts.body12};
      color: ${theme.colors.gray30};
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
        background-color: ${theme.colors.colorBlack};
        border: 1px solid ${theme.colors.gray50};
        border-radius: 50%;

        .add-icon {
          width: 16px;
          height: 16px;
          * {
            fill: ${theme.colors.colorWhite};
          }
        }
      }
    }
  }
`;
