import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";
import { media } from "@styles/media";
import mixins from "@styles/mixins";
import { Z_INDEX } from "@styles/zIndex";

export const VariableSelectBoxWrapper = styled.div`
  position: relative;
  ${mixins.flexbox("column", "flex-start", "center")};
  cursor: pointer;
  gap: 6px;

  > .error-text {
    color: ${({ theme }) => theme.color.red02};
    ${fonts.p4}
    ${media.mobile} {
      ${fonts.p6}
    }
  }

  &.disabled {
    cursor: default;

    > .selected-item-wrapper {
      color: ${({ theme }) => theme.color.text04};

      > .icon-arrow {
        path {
          fill: ${({ theme }) => theme.color.text04};
        }
      }
    }
  }

  > .selected-item-wrapper {
    ${mixins.flexbox("row", "center", "space-between")};
    width: 100%;
    border-radius: 8px;
    padding: 16px;
    color: ${({ theme }) => theme.color.text01};
    box-sizing: border-box;
    background-color: ${({ theme }) => theme.color.backgroundOpacity2};
    border: 1px solid ${({ theme }) => theme.color.border02};

    /* fonts */
    ${fonts.body9}
    ${media.mobile} {
      ${fonts.body11}
    }

    > .display-text {
      flex-grow: 1;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    > .icon-arrow {
      display: flex;
      flex-shrink: 0;
      path {
        fill: ${({ theme }) => theme.color.icon05};
      }
    }
  }
`;

export const VariableSelectOptionsWrapper = styled.div<{
  width: number;
  top: number;
  left: number;
}>`
  ${mixins.flexbox("column", "flex-start", "flex-start")};
  position: absolute;
  width: ${({ width }) => `${width}px`};
  top: ${({ top }) => `${top}px`};
  left: ${({ left }) => `${left}px`};
  background-color: ${({ theme }) => theme.color.background06};
  border: 1px solid ${({ theme }) => theme.color.border02};
  border-radius: 8px;
  box-shadow: 10px 14px 60px 0px rgba(0, 0, 0, 0.4);
  z-index: ${Z_INDEX.modalTooltip};
  overflow: auto;
  max-height: 183px;

  ${media.mobile} {
    transition: max-height 1s ease;
    position: fixed;
    top: auto;
    bottom: 0;
    width: 100vw;
    min-width: 360px;
    left: 0;
    z-index: ${Z_INDEX.fixed};
    max-height: 0;
    display: block;
  }

  > .select-list {
    ${mixins.flexbox("column", "flex-start", "flex-start")};
    width: 100%;
    padding: 8px 0;

    > .display-value {
      display: block;
      width: 100%;
      padding: 16px 24px;
      flex-grow: 1;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      color: ${({ theme }) => theme.color.text01};
      cursor: pointer;

      /* fonts */
      ${fonts.body9}
      ${media.mobile} {
        ${fonts.body11}
      }

      :hover {
        background-color: ${({ theme }) => theme.color.hover02};
      }
    }
  }
`;
