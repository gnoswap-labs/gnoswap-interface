import mixins from "@styles/mixins";
import { fonts } from "@constants/font.constant";
import { css, type Theme } from "@emotion/react";

export const wrapper = (theme: Theme) => css`
  ${mixins.flexbox("column", "flex-start", "center")}
  width: 100%;
  height: 100%;
  background-color: ${theme.color.background06};
  border: 1px solid ${theme.color.border02};
  box-shadow: 8px 8px 20px 0px rgba(0, 0, 0, 0.08);
  border-radius: 10px;
  padding: 16px 0px;
  h2 {
    ${mixins.flexbox("row", "center", "center")}
    ${fonts.body9};
    gap: 10px;
    color: ${theme.color.text02};
    margin-bottom: 16px;
    padding-left: 20px;
  }

  .icon-clock {
    width: 25px;
    height: 25px;
  }
`;
