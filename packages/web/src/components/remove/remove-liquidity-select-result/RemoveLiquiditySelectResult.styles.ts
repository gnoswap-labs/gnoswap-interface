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

  ul,
  .total-section {
    width: 100%;
    padding: 15px;
    background-color: ${theme.colors.opacityDark07};
    border: 1px solid ${theme.colors.gray50};
    border-radius: 8px;
  }

  ul {
    ${mixins.flexbox("column", "center", "center")};
    gap: 16px;
  }

  li {
    width: 100%;
    height: 39px;
    ${mixins.flexbox("column", "flex-end", "center")};
    gap: 3px;
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

  .total-section {
    ${mixins.flexbox("row", "center", "space-between")};
    height: 63px;
    h5 {
      ${fonts.body10};
    }
    .total-value {
      ${fonts.body6}
      color: ${theme.colors.gray10}
    }
  }
`;
