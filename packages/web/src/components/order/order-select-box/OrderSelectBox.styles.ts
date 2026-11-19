import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";
import { media } from "@styles/media";
import mixins from "@styles/mixins";
import { Z_INDEX } from "@styles/zIndex";

export const OrderSelectBoxWrapper = styled.div`
  position: relative;
  flex-shrink: 0;

  .select-trigger {
    ${mixins.flexbox("row", "center", "center")};
    gap: 4px;
    height: 28px;
    padding: 0px 8px 0px 12px;
    border-radius: 36px;
    ${fonts.p1};
    color: ${({ theme }) => theme.color.text02};
    background-color: ${({ theme }) => theme.color.background13};
    cursor: pointer;
    ${media.mobile} {
      ${fonts.p2};
    }
    &:disabled {
      cursor: default;
    }
    .icon-arrow {
      width: 16px;
      height: 16px;
      * {
        fill: ${({ theme }) => theme.color.icon01};
      }
    }
  }

  .select-list {
    ${mixins.flexbox("column", "stretch", "flex-start")};
    position: absolute;
    top: calc(100% + 4px);
    right: 0px;
    z-index: ${Z_INDEX.modal};
    min-width: 100%;
    padding: 4px 0px;
    border-radius: 8px;
    border: 1px solid ${({ theme }) => theme.color.border02};
    background-color: ${({ theme }) => theme.color.background06};
    box-shadow: 10px 14px 48px 0px rgba(0, 0, 0, 0.12);
  }

  .select-item {
    padding: 8px 16px;
    white-space: nowrap;
    text-align: left;
    ${fonts.p1};
    color: ${({ theme }) => theme.color.text04};
    cursor: pointer;
    &:hover,
    &.selected {
      color: ${({ theme }) => theme.color.text02};
      background-color: ${({ theme }) => theme.color.hover02};
    }
  }
`;
