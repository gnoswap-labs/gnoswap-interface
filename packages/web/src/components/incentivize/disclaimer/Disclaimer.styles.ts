import { fonts } from "@constants/font.constant";
import { css, Theme } from "@emotion/react";
import { media } from "@styles/media";
import mixins from "@styles/mixins";
import { PoolIncentivizeBoxStyle } from "../pool-incentivize/PoolIncentivize.styles";

export const wrapper = (theme: Theme) => css`
  ${PoolIncentivizeBoxStyle(theme)};
  ${mixins.flexbox("row", "flex-start", "center")};
  gap: 24px;
  background-color: ${theme.color.background03};
  border: 1px solid ${theme.color.border02};
  border-radius: 8px;
  padding: 15px;
  .section-title {
    color: ${theme.color.text04};
    ${fonts.body12}
  }
  .desc {
    height: auto;
    word-break: break-all;
    color: ${theme.color.text10};
    ${fonts.body12}
  }
  ${media.mobile} {
    ${mixins.flexbox("column", "flex-start", "center")};
    padding: 15px 11px;
    gap: 8px;
  }
`;
