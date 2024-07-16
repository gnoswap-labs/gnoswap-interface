import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";
import { media } from "@styles/media";
import mixins from "@styles/mixins";

export const StakePositionModalWrapper = styled.div`
  ${mixins.flexbox("column", "flex-start", "flex-start")};
  width: 460px;
  padding: 24px;
  gap: 16px;
  .modal-body {
    ${mixins.flexbox("column", "flex-start", "flex-start")};
    width: 100%;
    gap: 16px;
    .header {
      ${mixins.flexbox("row", "center", "space-between")};
      width: 100%;
      > h6 {
        ${fonts.h6}
        color: ${({ theme }) => theme.color.text02};
      }
      .close-wrap {
        ${mixins.flexbox("row", "center", "center")};
        cursor: pointer;
        width: 24px;
        height: 24px;
        .close-icon {
          width: 24px;
          height: 24px;
          * {
            fill: ${({ theme }) => theme.color.icon01};
          }
          &:hover {
            * {
              fill: ${({ theme }) => theme.color.icon07};
            }
          }
        }
      }
      ${media.mobile} {
        > h6 {
          ${fonts.body9};
        }
      }
    }

    .content {
      width: 100%;
      ${mixins.flexbox("column", "flex-start", "flex-start")};
      gap: 16px;
      .box-item {
        width: 100%;
        ${mixins.flexbox("column", "flex-start", "flex-start")};
        gap: 8px;
        h4 {
          ${fonts.body12}
          color: ${({ theme }) => theme.color.text10};
        }
        .item-content {
          width: 100%;
          ${mixins.flexbox("column", "flex-start", "flex-start")};
          border-radius: 8px;
          padding: 15px;
          background: ${({ theme }) => theme.color.background20};
          border: 1px solid ${({ theme }) => theme.color.border02};
          gap: 16px;
          ${media.mobile} {
            padding: 11px;
            gap: 8px;
          }
          > div {
            width: 100%;
            ${mixins.flexbox("row", "center", "space-between")};
          }
          .label {
            ${fonts.body12}
            color: ${({ theme }) => theme.color.text04};
            ${mixins.flexbox("row", "center", "center")};
            gap: 4px;
          }
          .label-logo {
            gap: 5px;
            ${mixins.flexbox("row", "center", "center")};
            > div {
              color: ${({ theme }) => theme.color.text03};
              ${fonts.body12}
            }
          }
          svg {
            width: 16px;
            height: 16px;
          }
          svg {
            * {
              fill: ${({ theme }) => theme.color.text04};
            }
          }
          .value {
            ${fonts.body12}
            color: ${({ theme }) => theme.color.text02};
          }
          .label-large {
            color: ${({ theme }) => theme.color.text04};
            ${fonts.body9}
            ${media.mobile} {
              ${fonts.body12};
            }
          }
          .value-large {
            ${fonts.body9}
            color: ${({ theme }) => theme.color.text02};
            ${media.mobile} {
              ${fonts.body12};
            }
          }
          .position-bar {
            > div {
              ${fonts.p4}
              color: ${({ theme }) => theme.color.text12};
            }
          }
        }
      }
      > div {
        width: 100%;
        .button-confirm {
          gap: 8px;
          height: 57px;
          span {
            ${fonts.body7}
          }
          ${media.mobile} {
            height: 44px;
            span {
              ${fonts.body9}
            }
          }
        }
      }
    }
  }
  ${media.mobile} {
    padding: 15px;
    width: 328px;
    .modal-body {
      gap: 12px;
      .content {
        gap: 12px;
        > div {
          .button-connect {
            height: 44px;
            span {
              ${fonts.body9}
            }
          }
        }
      }
    }
  }
`;


export const Divider = styled.div`
  width: 100%;
  border-top: 1px solid ${({ theme }) => theme.color.border02};
`;

export const ToolTipContentWrapper = styled.div`
  width: 268px;
  ${fonts.body12}
  color: ${({ theme }) => theme.color.text02};
`;
