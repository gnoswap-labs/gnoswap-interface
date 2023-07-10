import { fonts } from "@constants/font.constant";
import { css, Theme } from "@emotion/react";
import mixins from "@styles/mixins";

export const wrapper = (theme: Theme) => css`
  ${mixins.flexbox("column", "flex-start", "center")};
  ${fonts.body3};
  width: 100%;
  color: ${theme.color.text02};
  background-color: ${theme.color.background06};
  border-radius: 8px;
  border: 1px solid ${theme.color.border02};
  height: 170px;
  padding: 36px;
  .emphasis-text {
    ${fonts.h5}
    color: ${theme.color.point};
  }
  .description {
    ${fonts.body10};
    color: ${theme.color.text05};
    margin-top: 8px;
  }
`;
