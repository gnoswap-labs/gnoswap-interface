import { css } from "@emotion/css";
import { Theme } from "@emotion/react";

import { fonts } from "@constants/font.constant";
import mixins from "@styles/mixins";

export const RepositionContentBoxStyle = (theme: Theme) => css`
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
