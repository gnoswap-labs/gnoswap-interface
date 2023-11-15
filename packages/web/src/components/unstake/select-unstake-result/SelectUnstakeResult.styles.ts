import { fonts } from "@constants/font.constant";
import { css, type Theme } from "@emotion/react";
import mixins from "@styles/mixins";

export const wrapper = (theme: Theme) => css`
  ${mixins.flexbox("column", "center", "center")};
  gap: 4px;
  width: 100%;
  color: ${theme.color.text03};
  ${fonts.body12};
  border-top: 1px solid ${theme.color.border02};
  padding-top: 16px;

  ul {
    ${mixins.flexbox("column", "center", "center")};
    width: 100%;
    padding: 15px;
    background-color: ${theme.color.background20};
    border: 1px solid ${theme.color.border02};
    border-radius: 8px;
    gap: 16px;
  }

  li {
    width: 100%;
    img {
      width: 24px;
      height: 24px;
    }
  }

  .pooled-section li {
    ${mixins.flexbox("row", "center", "flex-start")};
    height: 24px;
    .token-id {
      margin-left: 8px;
    }
    .period-value {
      margin-left: auto;
    }
  }

  .result-section li {
    height: 39px;
    ${mixins.flexbox("column", "flex-end", "center")};
    .main-info {
      width: 100%;
      height: 24px;
      ${mixins.flexbox("row", "center", "center")};
      p {
        color: ${theme.color.text03};
        margin-left: 5px;
      }
      strong {
        margin-left: auto;
      }
    }

    .dallor {
      ${fonts.p4}
      color: ${theme.color.text04}
    }
  }
`;
