import { fonts } from "@constants/font.constant";
import { css, type Theme } from "@emotion/react";
import { media } from "@styles/media";
import mixins from "@styles/mixins";

export const wrapper = (theme: Theme) => css`
  ${mixins.flexbox("column", "flex-box", "center")};
  width: 100%;
  background-color: ${theme.color.background01};
  border: 1px solid ${theme.color.border02};
  border-radius: 8px;
  color: ${theme.color.text01};
  gap: 12px;
  padding: 24px;
  h2 {
    ${fonts.body7};
  }
  @media (max-width: 1180px) {
    padding: 16px;
  }
  ${media.mobile} {
    h2 {
      ${fonts.body9};
    }
    margin-top: 16px;
    ${fonts.body9};
    border: none;
    gap: 8px;
    padding: 0;
  }
`;
