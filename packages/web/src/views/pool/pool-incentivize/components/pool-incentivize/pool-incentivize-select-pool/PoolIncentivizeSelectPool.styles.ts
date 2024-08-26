import styled from "@emotion/styled";

import { fonts } from "@constants/font.constant";
import { media } from "@styles/media";
import mixins from "@styles/mixins";
import { Z_INDEX } from "@styles/zIndex";

import { PoolIncentivizeBoxStyle } from "../PoolIncentivize.styles";

interface Props {
  isDisabled?: boolean;
}

export const PoolIncentivizeSelectPoolWrapper = styled.div<Props>`
  ${({ theme }) => PoolIncentivizeBoxStyle(theme)};
  position: relative;
  display: flex;
  width: 100%;
  flex-direction: column;
  justify-content: center;
  gap: 16px;

  h5 {
    color: ${({ isDisabled, theme }) => {
      return isDisabled ? theme.color.text04 : theme.color.text10;
    }};
    ${fonts.body12}
  }
  ${media.mobile} {
    gap: 8px;
  }
  .pool-select-wrapper {
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
    pointer-events: ${({ isDisabled }) => !isDisabled ? "" : "none"};
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

export const PoolIncentivizeSelectPoolBox = styled.div`
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

  .search-wrapper {
    padding: 16px 24px;
    cursor: default;
  }

  .pool-list-wrapper {
    padding-bottom: 8px;

    .pool-list-headrer {
      ${mixins.flexbox("flex", "center", "space-between")}
      padding: 0 24px 8px 24px;
      color: ${({ theme }) => theme.color.text04};
      ${fonts.p4}
      cursor: default;
    }

    .pool-list-content {
      max-height: 280px;
      overflow-y: auto;

      & > div {
        padding: 16px 24px;
      }
    }
  }
  ${media.mobile} {
    top: auto;
    bottom: 0;
    left: 0;
    width: 100vw;
    position: fixed;
    min-width: 360px;
    z-index: ${Z_INDEX.fixed};
    max-height: 0;
    transition: max-height 0.8s ease;
    display: block;
  }
  &.open {
    display: block;
    ${media.mobile} {
      max-height: 600px;
    }
  }
`;
