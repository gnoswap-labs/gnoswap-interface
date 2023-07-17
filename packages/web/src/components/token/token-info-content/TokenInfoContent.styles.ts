import { css, type Theme } from "@emotion/react";
import mixins from "@styles/mixins";

export const wrapper = (theme: Theme) => css`
  ${mixins.flexbox("column", "center", "center")};
  width: 100%;
  background-color: ${theme.color.background01};
  border-radius: 8px;
  border: 1px solid ${theme.color.border02};
`;
