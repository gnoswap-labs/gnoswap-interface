import { fonts } from "@constants/font.constant";
import { css, type Theme } from "@emotion/react";
import mixins from "@styles/mixins";

export const wrapper = (theme: Theme) => css`
  ${mixins.flexbox("column", "center", "center")};
  gap: 4px;
  width: 100%;
  color: ${theme.colors.gray20};
  ${fonts.body12};
  border-top: 1px solid ${theme.colors.gray50};
  padding-top: 16px;

  .pooled-section,
  .result-section {
    ${mixins.flexbox("column", "center", "center")};
    width: 100%;
    padding: 15px;
    background-color: ${theme.colors.opacityDark07};
    border: 1px solid ${theme.colors.gray50};
    border-radius: 8px;
    gap: 16px;
  }

  li {
    width: 100%;
    height: 39px;
    ${mixins.flexbox("column", "flex-end", "center")};
    /* gap: 5px; */
    .main-info {
      width: 100%;
      height: 24px;
      ${mixins.flexbox("row", "center", "center")};

      img {
        width: 24px;
        height: 24px;
      }
      p {
        margin-left: 5px;
      }
      strong {
        margin-left: auto;
      }
    }

    .dallor {
      ${fonts.p4}
      color: ${theme.colors.gray40}
    }
  }

  .result-section {
    ${mixins.flexbox("column", "center", "center")};
    height: 90px;
    color: ${theme.colors.gray10};
    ${fonts.body12}
    .result-value {
      margin-left: auto;
    }
    .total-amount-box,
    .apr-box {
      width: 100%;
      ${mixins.flexbox("row", "center", "flex-start")};
    }
    .total-amount-box {
      height: 24px;
    }
    .apr-box {
      height: 18px;
    }
    h5 {
      margin-right: 4px;
      &.total-amount-title {
        margin-right: 8px;
      }
    }
  }

  .hover-info {
    &,
    & * {
      width: 16px;
      height: 16px;
    }
    cursor: pointer;
    .icon-info {
      * {
        fill: ${theme.colors.gray40};
      }
    }
  }
`;
