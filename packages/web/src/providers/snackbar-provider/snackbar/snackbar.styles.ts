import { keyframes } from "@emotion/react";
import styled from "@emotion/styled";

import { media } from "@styles/media";
import mixins from "@styles/mixins";
import { fonts } from "@constants/font.constant";

const toastInRight = keyframes`
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
`;

const toastOutRightClose = keyframes`
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(150%);
  }
`;

export const SnackbarWrapper = styled.div`
  box-shadow: ${({ theme }) => theme.color.shadow};
  padding: 15px 23px;
  color: ${({ theme }) => theme.color.text02};
  background-color: ${({ theme }) => theme.color.background06};
  border: 1px solid ${({ theme }) => theme.color.border02};
  border-radius: 8px;
  margin-top: 10px;
  position: relative;
  &.toast-item {
    animation: ${toastInRight} 500ms forwards;
  }
  &.closing {
    animation: ${toastOutRightClose} 500ms forwards;
  }
  ${media.mobile} {
    width: 100%;
    top: 16px;
    left: 50%;
    transform: translateX(-50%);
    height: fit-content;
    padding: 15px;
  }
  .icon-close {
    width: 24px;
    height: 24px;
    position: absolute;
    top: 16px;
    right: 24px;
    cursor: pointer;
    svg {
      width: 24px;
      height: 24px;
      * {
        fill: ${({ theme }) => theme.color.icon03};
      }
      &:hover {
        * {
          fill: ${({ theme }) => theme.color.icon07};
        }
      }
    }
    ${media.mobile} {
      right: 16px;
    }
  }
  .notice-body {
    width: 100%;
    ${mixins.flexbox("row", "flex-start", "flex-start")};
    gap: 16px;
    .icon-success {
      width: 36px;
      height: 36px;
      ${media.mobile} {
        width: 24px;
        height: 24px;
      }
    }
    .loading-icon {
      width: 36px;
      height: 36px;
      &:before {
        width: 24px;
        height: 24px;
      }
      ${media.mobile} {
        width: 24px;
        height: 24px;
        &:before {
          width: 15.4px;
          height: 15.4px;
        }
      }
    }
    > div {
      ${mixins.flexbox("column", "flex-start", "flex-start")};

      gap: 8px;
      h5 {
        ${fonts.body7};
        color: ${({ theme }) => theme.color.text02};
        line-height: 23px;
        ${media.mobile} {
          ${fonts.body7}
        }
      }
      .waiting-confirmation {
        ${fonts.body12}
        color: ${({ theme }) => theme.color.text19};
      }
      .description {
        ${fonts.body12}
        color: ${({ theme }) => theme.color.text22};
        span {
          color: ${({ theme }) => theme.color.text16};
          font-weight: 500;
        }
        ${media.mobile} {
          ${fonts.p2}
        }
      }
      a {
        width: 100%;
        ${mixins.flexbox("row", "center", "flex-start")};
        ${fonts.body11}
        color: ${({ theme }) => theme.color.text04};
        gap: 4px;
        ${media.mobile} {
          ${fonts.p2}
        }
        &:hover {
          color: ${({ theme }) => theme.color.icon07};
          svg * {
            fill: ${({ theme }) => theme.color.icon07};
          }
        }
        svg {
          width: 16px;
          height: 16px;
        }
      }
      ${media.mobile} {
        padding-right: 24px;
      }
    }
  }
`;
