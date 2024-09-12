import styled from "@emotion/styled";

import { fonts } from "@constants/font.constant";
import { media } from "@styles/media";
import mixins from "@styles/mixins";
import { Z_INDEX } from "@styles/zIndex";


interface Props {
  isDisabled?: boolean;
}

export const UndelegateSelectWrapper = styled.div<Props>`
  position: relative;
  width: 100%;
  ${mixins.flexbox("column", "flex-start", "center")};
  background-color: ${({ theme }) => theme.color.backgroundOpacity5};
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.color.border02};
  padding: 15px;
  gap: 16px;

  .section-title {
    ${mixins.flexbox("row", "center", "flex-start")};
    width: 100%;
    gap: 4px;
    color: ${({ theme }) => theme.color.text10};
    ${fonts.body12}

    svg {
      path {
        fill: ${({ theme }) => theme.color.icon03};
      }
    }
  }

  ${media.mobile} {
    gap: 8px;
  }
  .undelegate-select-wrapper {
    position: relative;
    display: flex;
    width: 100%;
    height: 48px;
    padding: 0 15px;
    border-radius: 8px;
    border: 1px solid ${({ theme }) => theme.color.border02};
    background: ${({ theme }) => theme.color.background20};
    &:hover {
      background: ${({ theme }) => theme.color.background11};
      cursor: pointer;
    }
    pointer-events: ${({ isDisabled }) => (!isDisabled ? "" : "none")};
    color: var(--text-02-dark-gray-100-text-2, #e0e8f4);
    ${fonts.body9}
    justify-content: space-between;
    align-items: center;

    > .icon-wrapper {
      width: 24px;
      height: 24px;
      display: flex;
      justify-content: center;
      align-items: center;
      * {
        fill: ${({ theme }) => theme.color.icon01};
      }
      .icon-arrow {
        fill: ${({ theme }) => theme.color.icon08};
      }
    }
    ${media.mobile} {
      padding: 0 11px;
    }
  }
`;

export const UndelegateSelectBox = styled.div`
  position: absolute;
  top: 53px;
  left: 0;
  width: 100%;
  background-color: ${({ theme }) => theme.color.background06};
  border: 1px solid ${({ theme }) => theme.color.border02};
  border-radius: 8px;
  box-shadow: 10px 14px 60px 0px rgba(0, 0, 0, 0.4);
  z-index: 4;
  display: none;

  .delegate-list-wrapper {
    padding-bottom: 8px;

    .delegate-list-headrer {
      ${mixins.flexbox("flex", "center", "space-between")}
      padding: 16px 24px;
      color: ${({ theme }) => theme.color.text04};
      ${fonts.p4}
      cursor: default;
    }

    .delegate-list-content {
      max-height: 280px;
      overflow-y: auto;

      & > div {
        padding: 16px 24px;
      }
    }
  }
  // not speced mobile UI yet
  // ${media.mobile} {
  //   top: auto;
  //   bottom: 0;
  //   left: 0;
  //   width: 100vw;
  //   position: fixed;
  //   min-width: 360px;
  //   z-index: ${Z_INDEX.fixed};
  //   max-height: 0;
  //   transition: max-height 0.8s ease;
  //   display: block;
  // }
  &.open {
    display: block;
    ${media.mobile} {
      max-height: 600px;
    }
  }
`;

export const ToolTipContentWrapper = styled.div`
  width: 268px;
  ${fonts.body12}
  color: ${({ theme }) => theme.color.text02};
`;
