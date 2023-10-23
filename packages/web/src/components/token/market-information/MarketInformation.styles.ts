import { fonts } from "@constants/font.constant";
import { css, Theme } from "@emotion/react";
import { media } from "@styles/media";
import mixins from "@styles/mixins";

export const wrapper = (theme: Theme) => css`
  ${mixins.flexbox("column", "flex-start", "center")};
  ${fonts.body7};
  width: 100%;
  color: ${theme.color.text01};
  gap: 12px;
  padding: 24px;

  @media (max-width: 1180px) {
    padding: 16px;
  }
  ${media.mobile} {
    ${fonts.body9};
    gap: 8px;
    padding: 0;
  }
`;
