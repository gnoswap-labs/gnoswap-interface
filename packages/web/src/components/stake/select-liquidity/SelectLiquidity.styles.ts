import { css, type Theme } from "@emotion/react";
import { sectionBoxStyle } from "../stake-position/StakePosition.styles";

export const wrapper = (theme: Theme) => css`
  ${sectionBoxStyle(theme)};
`;
