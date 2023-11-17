import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";
import { media } from "@styles/media";
import mixins from "@styles/mixins";

export const SelectPriceRangeWrapper = styled.div`
  ${mixins.flexbox("column", "center", "center")};
  width: 100%;
  gap: 8px;

  .type-selector-wrapper {
    ${mixins.flexbox("column", "center", "center")};
    width: 100%;
    gap: 8px;
  }

  .detail-selector-wrapper {
    ${mixins.flexbox("column", "center", "center")};
    width: 100%;
  }
`;

export const SelectPriceRangeItemWrapper = styled.div`
  ${mixins.flexbox("row", "center", "space-between")};
  width: 100%;
  height: 50px;
  border: 1px solid ${({ theme }) => theme.color.border02};
  border-radius: 8px;
  padding: 15px;
  cursor: pointer;
  transition: all 0.3s ease;

  &.selected,
  &:hover {
    background-color: ${({ theme }) => theme.color.background11};
    border: 1px solid ${({ theme }) => theme.color.border03};
  }

  .item-title {
    color: ${({ theme }) => theme.color.text02};
    ${fonts.body11};
  }

  .tooltip-wrap {
    width: 16px;
    height: 16px;
    margin-left: 4px;
    & * {
      ${mixins.flexbox("row", "center", "center")};
    }
    .tooltip-icon {
      width: 100%;
      height: 100%;
      * {
        fill: ${({ theme }) => theme.color.icon03};
      }
    }
  }

  .apr {
    color: ${({ theme }) => theme.color.text02};
    ${fonts.body11};
    margin-left: auto;
  }
  ${media.mobile} {
    padding: 12px;
  }
`;

export const TooltipContentWrapper = styled.div`
  width: 296px;
  ${fonts.body12}
  color: ${({ theme }) => theme.color.text02};
`;