import styled from "@emotion/styled";

import SelectBox from "@components/common/select-box/SelectBox";
import { fonts } from "@constants/font.constant";
import { media } from "@styles/media";
import mixins from "@styles/mixins";

import { POSITION_ACTION } from "./types";

export const ManageButtonWrapper = styled(SelectBox<POSITION_ACTION>)`
  width: auto;
  height: 36px;
  cursor: pointer;
  background: ${({ theme }) => theme.color.background13};
  border: 1px solid ${({ theme }) => theme.color.border18};
  &:hover {
    background: ${({ theme }) => theme.color.backgroundGradient};
  }
  .current {
    color: ${({ theme }) => theme.color.text14};
    ${fonts.p1}
    margin-right: 8px;
  }
  .select-item {
    left: auto;
    right: -1px;
    top: 43px;
    min-width: 165px;
    background: ${({ theme }) => theme.color.background01};
    box-shadow: ${({ theme }) => theme.color.shadow};
    .item-wrapper {
      margin-bottom: 4px;
      padding: 10px 16px;
      height: 37px;
      > div {
        font-weight: 500;
      }
      &:hover {
        background: ${({ theme }) => theme.color.background11};
        > div {
          color: ${({ theme }) => theme.color.text16};
        }
      }
      &:first-of-type {
        border-top-right-radius: 8px;
        border-top-left-radius: 8px;
      }
      &:last-of-type {
        border-bottom-right-radius: 8px;
        border-bottom-left-radius: 8px;
        margin-bottom: 0;
      }
    }
  }
  &.out-range {
    :not(&.staked) {
      background: linear-gradient(270deg, #536cd7 0%, #233dbd 100%);
      .current {
        color: ${({ theme }) => theme.color.text27};
      }
    }

    &.stakable {
      .item-wrapper {
        &:nth-of-type(3) {
          > div {
            color: ${({ theme }) => theme.color.text29};
          }
        }
      }
    }
    :not(&.stakable) {
      .item-wrapper {
        &:nth-of-type(2) {
          > div {
            color: ${({ theme }) => theme.color.text29};
          }
        }
      }
    }
  }

  ${media.mobile} {
    .select-item {
      position: absolute;
      height: fit-content;
      display: none;
      min-width: 165px;
    }
    .open {
      display: block;
    }
  }

  @media (max-width: 360px) {
    position: relative;
    width: 100%;
    .selected-wrapper {
      ${mixins.flexbox("row", "center", "center")};
    }
    .select-item {
      position: absolute;
      height: fit-content;
      display: none;
      width: 100%;
      max-width: 303px;
      min-width: auto;
      left: 0;
      right: auto;
    }
    .open {
      display: block;
    }
  }
`;

export const ManageItem = styled.div`
  ${mixins.flexbox("row", "center", "flex-start")};
  ${fonts.p2}
  color: ${({ theme }) => theme.color.text22};
`;
