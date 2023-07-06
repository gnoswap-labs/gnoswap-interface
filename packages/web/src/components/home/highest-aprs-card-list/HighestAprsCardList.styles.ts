import mixins from "@styles/mixins";
import { fonts } from "@constants/font.constant";
import { css, type Theme } from "@emotion/react";

export const wrapper = (theme: Theme) => css`
  ${mixins.flexbox("column", "flex-start", "center")}
  width: 100%;
  height: 100%;
  background-color: ${theme.colors.gray60};
  border: 1px solid ${theme.colors.gray50};
  box-shadow: 8px 8px 20px rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  padding: 16px 0px;
  h2 {
    ${mixins.flexbox("row", "center", "center")}
    ${fonts.body9};
    gap: 10px;
    color: ${theme.colors.gray10};
    margin-bottom: 16px;
    padding-left: 20px;
  }

  .icon-diamond {
    width: 20px;
    height: 20px;
  }
`;
