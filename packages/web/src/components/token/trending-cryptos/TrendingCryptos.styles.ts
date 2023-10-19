import { fonts } from "@constants/font.constant";
import { css, Theme } from "@emotion/react";
import { media } from "@styles/media";
import mixins from "@styles/mixins";

export const wrapper = (theme: Theme) => css`
  ${mixins.flexbox("column", "flex-start", "center")};
  width: 100%;
  background-color: ${theme.color.background01};
  border: 1px solid ${theme.color.border02};
  border-radius: 8px;
  padding: 24px 0px;
  gap: 12px;
  ${media.mobile} {
    gap: 8px;
  }
  h2 {
    ${fonts.body9};
    color: ${theme.color.text01};
    width: 100%;
    padding: 0px 24px;
  }
`;
