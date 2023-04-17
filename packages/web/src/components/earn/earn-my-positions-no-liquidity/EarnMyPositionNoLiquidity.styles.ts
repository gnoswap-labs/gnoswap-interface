import { fonts } from "@constants/font.constant";
import { css, Theme } from "@emotion/react";
import mixins from "@styles/mixins";

export const wrapper = (theme: Theme) => css`
  ${mixins.flexbox("column", "flex-start", "center")};
  ${fonts.body3};
  width: 100%;
  color: ${theme.colors.gray10};
  background-color: ${theme.colors.gray60};
  border-radius: 8px;
  border: 1px solid ${theme.colors.gray50};
  height: 170px;
  padding: 36px;
  .emphasis-text {
    ${fonts.h5}
    color: ${theme.colors.colorPoint};
  }
  .description {
    ${fonts.body10};
    color: ${theme.colors.gray30};
    margin-top: 8px;
  }
`;
