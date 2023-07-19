import { fonts } from "@constants/font.constant";
import { css, Theme } from "@emotion/react";
import mixins from "@styles/mixins";

export const wrapper = (theme: Theme) => css`
  ${mixins.flexbox("column", "center", "center")};
  ${fonts.body10};
  width: 100%;
  color: ${theme.color.text10};
  background-color: ${theme.color.background11};
  border-radius: 8px;
  border: 1px solid ${theme.color.border02};
  height: 267px;
  .unconnected-icon {
    width: 48px;
    height: 48px;
    * {
      fill: ${theme.color.icon03};
    }
  }
  p {
    text-align: center;
    margin: 24px 0px;
  }
`;
