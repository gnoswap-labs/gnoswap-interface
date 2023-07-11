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
    height: 67px;
    width: 100%;
  }
`;

export const sectionBoxStyle = (theme: Theme) => css`
  ${mixins.flexbox("column", "flex-start", "center")};
  width: 100%;
  background-color: ${theme.color.backgroundOpacity};
  border-radius: 8px;
  border: 1px solid ${theme.color.border02};
  padding: 15px;
  gap: 16px;
  .section-title {
    color: ${theme.color.text05};
    ${fonts.body12}
  }
`;
