import { css, type Theme } from "@emotion/react";
import { sectionBoxStyle } from "@components/stake/stake-liquidity/StakeLiquidity.styles";

export const wrapper = (theme: Theme) => css`
  ${sectionBoxStyle(theme)};
`;
