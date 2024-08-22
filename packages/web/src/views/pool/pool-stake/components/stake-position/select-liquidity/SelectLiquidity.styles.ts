import { css, type Theme } from "@emotion/react";
import { sectionBoxStyle } from "../StakePosition.styles";

export const wrapper = (theme: Theme) => css`
  ${sectionBoxStyle(theme)};
`;
