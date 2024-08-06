import { fonts } from "@constants/font.constant";
import { css, Theme } from "@emotion/react";
import styled from "@emotion/styled";
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
    white-space: nowrap;
    color: ${theme.color.text04};
    ${fonts.body12}
  }
  .desc {
    height: auto;
    word-break: break-word;
    color: ${theme.color.text10};
    ${fonts.body12}
  }
  ${media.mobile} {
    ${mixins.flexbox("column", "flex-start", "center")};
    padding: 15px 11px;
    gap: 8px;
  }
`;

export const IconButton = styled.button`
  ${mixins.flexbox("row", "center", "center")};
  width: 16px;
  height: 16px;
  margin: 1px 0px 1px 2px;
  ${media.tablet} {
    margin-left: 2px;
  }
  ${media.mobile} {
    margin-left: 0;
  }
  svg * {
    fill: ${({ theme }) => theme.color.icon03};
  }
  :hover {
    svg * {
      fill: ${({ theme }) => theme.color.icon07};
    }
  }
`;