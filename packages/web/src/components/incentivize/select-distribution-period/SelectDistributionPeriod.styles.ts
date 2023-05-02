import { fonts } from "@constants/font.constant";
import { css, Theme } from "@emotion/react";
import mixins from "@styles/mixins";

export const wrapper = (theme: Theme) => css`
  ${sectionBoxStyle(theme)};

  .select-date-wrap {
    ${mixins.flexbox("row", "center", "space-between")};
    gap: 16px;
    width: 100%;
  }
  .start-date,
  .end-date {
    border: 1px solid green;
    height: 67px;
    width: 100%;
  }
`;

export const sectionBoxStyle = (theme: Theme) => css`
  ${mixins.flexbox("column", "flex-start", "center")};
  width: 100%;
  background-color: ${theme.colors.opacityDark07};
  border-radius: 8px;
  border: 1px solid ${theme.colors.gray50};
  padding: 15px;
  gap: 16px;
  .section-title {
    color: ${theme.colors.gray30};
    ${fonts.body12}
  }
`;
