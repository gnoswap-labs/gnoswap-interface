import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";
import { media } from "@styles/media";
import mixins from "@styles/mixins";

export const MyLiquidityWrapper = styled.div`
  ${mixins.flexbox("column", "flex-start", "flex-start")};
  width: 100%;
  gap: 16px;
  ${media.tablet} {
    gap: 24px;
  }
  ${media.mobile} {
    gap: 12px;
  }

  .liquidity-wrap {
    ${mixins.flexbox("column", "center", "center")};
    width: 100%;
    gap: 24px;
  }

  .slider-wrap {
    ${mixins.flexbox("column", "flex-start", "flex-start")};
    width: 100%;
    overflow-x: auto;
    gap: 12px;
    .box-slider {
      ${mixins.flexbox("row", "flex-start", "flex-start")};
      gap: 12px;
    }
  }
  .box-indicator {
    ${mixins.flexbox("row", "center", "center")};
    width: 100%;
    gap: 4px;
    span {
      color: ${({ theme }) => theme.color.text04};
      ${fonts.body12};
    }
    .current-page {
      color: ${({ theme }) => theme.color.text05};
    }
  }
`;

export const PoolDivider = styled.div`
  ${mixins.flexbox("column", "flex-start", "flex-start")};
  width: 100%;
  height: 1px;
  align-self: stretch;
  background: ${({ theme }) => theme.color.border02};
`;
