import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";
import { media } from "@styles/media";
import mixins from "@styles/mixins";

export const OrderInfoRowsWrapper = styled.div`
  ${mixins.flexbox("column", "flex-start", "flex-start")};
  width: 100%;
  gap: 16px;
  ${media.mobile} {
    gap: 12px;
  }

  .info-row {
    ${mixins.flexbox("row", "flex-start", "space-between")};
    width: 100%;
    gap: 8px;
    ${fonts.body12};
    ${media.mobile} {
      ${fonts.p2};
    }
  }

  .info-label {
    ${mixins.flexbox("row", "center", "flex-start")};
    flex-shrink: 0;
    gap: 4px;
    color: ${({ theme }) => theme.color.text04};
    .icon-info {
      width: 16px;
      height: 16px;
      * {
        fill: ${({ theme }) => theme.color.icon03};
      }
    }
  }

  .info-value {
    ${mixins.flexbox("column", "flex-end", "flex-start")};
    min-width: 0;
    gap: 4px;
    text-align: right;
    color: ${({ theme }) => theme.color.text02};
    .main-value {
      ${mixins.flexbox("row", "center", "flex-end")};
      gap: 4px;
      word-break: break-all;
    }
    .sub-value {
      ${fonts.p2};
      color: ${({ theme }) => theme.color.text04};
    }
  }
`;

export const OrderInfoTooltipContent = styled.div`
  max-width: 268px;
  ${fonts.body12};
  color: ${({ theme }) => theme.color.text02};
`;
