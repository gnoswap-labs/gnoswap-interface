import { fonts } from "@constants/font.constant";
import mixins from "@styles/mixins";

import styled from "@emotion/styled";
import { Theme } from "@emotion/react";
import { css } from "@emotion/css";
import { media } from "@styles/media";

export const PoolIncentivizeWrapper = styled.div`
  ${mixins.flexbox("column", "flex-start", "flex-start")};
  gap: 16px;
  width: 500px;
  height: 100%;
  color: ${({ theme }) => theme.color.text02};
  background-color: ${({ theme }) => theme.color.background20};
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.color.border02};
  box-shadow: 10px 14px 60px rgba(0, 0, 0, 0.4);
  padding: 23px;
  margin: 0 auto;
  ${media.mobile} {
    padding: 11px;
  }

  .title {
    ${fonts.h6};
  }

  article {
    ${mixins.flexbox("column", "flex-start", "center")};
    width: 100%;
    background-color: ${({ theme }) => theme.color.background20};
    border-radius: 8px;
    border: 1px solid ${({ theme }) => theme.color.border02};
    padding: 15px;
    gap: 16px;

    ${media.mobile} {
      padding: 11px;
    }
    .section-title {
      color: ${({ theme }) => theme.color.text10};
      ${fonts.body12}
    }
  }
`;

export const PoolIncentivizeBoxStyle = (theme: Theme) => css`
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
