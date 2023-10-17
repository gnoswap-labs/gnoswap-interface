import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";
import { media } from "@styles/media";
import mixins from "@styles/mixins";
import { Z_INDEX } from "@styles/zIndex";
export const CreateProposalModalBackground = styled.div`
  position: fixed;
  overflow: hidden;
  top: 0px;
  bottom: 0px;
  left: 0px;
  right: 0px;
  width: 100%;
  height: 100lvh;
  background: rgba(10, 14, 23, 0.7);
  z-index: ${Z_INDEX.modalOverlay};
`;

export const CreateProposalModalWrapper = styled.div`
  ${mixins.flexbox("column", "flex-start", "flex-start")};
  position: absolute;
  overflow: hidden;
  width: 700px;
  border-radius: 8px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 10px 14px 60px 0px rgba(0, 0, 0, 0.4);
  background-color: ${({ theme }) => theme.color.background06};
  .btn-submit {
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    height: 57px;
  }
  ${media.mobile} {
    width: 328px;
    .btn-submit {
      height: 41px;
      border-top-left-radius: 0;
      border-top-right-radius: 0;
    }
  }
  .modal-body {
    border: 1px solid ${({ theme }) => theme.color.border02};
    ${mixins.flexbox("column", "flex-start", "flex-start")};
    width: 100%;
    padding: 24px 24px 5px 24px;
    overflow: scroll;
    gap: 16px;
    max-height: calc(100lvh - 100px);
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
        }
      }
      ${media.mobile} {
        > h6 {
          ${fonts.body9}
        }
      }
    }
    ${media.mobile} {
      padding: 12px;
    }
  }
`;

export const BoxItem = styled.div`
  ${mixins.flexbox("column", "flex-start", "flex-start")};
  width: 100%;
  padding: 16px;
  gap: 16px;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.color.backgroundOpacity2};
  border: 1px solid ${({ theme }) => theme.color.border02};
  position: relative;
  .multiple-variable {
    width: 100%;
    gap: 12px;
    ${mixins.flexbox("row", "flex-start", "flex-start")};
    div:first-of-type {
      ${mixins.flexbox("row", "flex-start", "flex-start")};
      gap: 8px;
      > div {
        ${mixins.flexbox("column", "flex-start", "flex-start")};
      }
      ${media.mobile} {
        width: 100%;
        ${mixins.flexbox("column", "flex-start", "flex-start")};
      }
    }
    gap: 8px;
  }
  .box-label {
    ${fonts.body12};
    color: ${({ theme }) => theme.color.text03};
  }
  .type-tab {
    ${mixins.flexbox("row", "center", "center")};
    width: 100%;
    gap: 8px;
    ${fonts.body11};
    > div {
      cursor: pointer;
      flex: 1;
      border: 1px solid ${({ theme }) => theme.color.border02};
      padding: 12px 8px 12px 8px;
      border-radius: 8px;
      text-align: center;
      color: ${({ theme }) => theme.color.text02};
      &:hover {
        background-color: ${({ theme }) => theme.color.background11};
        border: 1px solid ${({ theme }) => theme.color.border03};
      }
    }
    .active-type-tab {
      background-color: ${({ theme }) => theme.color.background11};
      border: 1px solid ${({ theme }) => theme.color.border03};
    }
  }
  ${media.mobile} {
    gap: 12px;
    padding: 12px;
    .type-tab {
      ${mixins.flexbox("column", "flex-start", "flex-start")};
      > div {
        width: 100%;
      }
    }
  }
  .deposit {
    ${mixins.flexbox("row", "center", "space-between")};
    border: 1px solid ${({ theme }) => theme.color.border02};
    border-radius: 8px;
    padding: 16px;
    width: 100%;
    > span {
      ${fonts.body7};
      color: ${({ theme }) => theme.color.text02};
    }
  }
  .deposit-currency {
    ${mixins.flexbox("row", "center", "space-between")};
    gap: 8px;
    span {
      color: ${({ theme }) => theme.color.text01};
      ${fonts.body9};
    }
    img {
      height: 24px;
      width: 24px;
    }
  }
  .suffix-wrapper {
    position: relative;
    width: 100%;
    input {
      ${fonts.body1};
      padding: 16px 110px 16px 24px;
      &::placeholder {
        ${fonts.body1};
        color: ${({ theme }) => theme.color.text01};
      }
      ${media.mobile} {
        padding: 16px 110px 16px 16px;
        ${fonts.body5};
        &::placeholder {
          ${fonts.body5};
        }
      }
    }
  }
  .suffix-currency {
    position: absolute;
    right: 24px;
    top: 21px;
    background-color: ${({ theme }) => theme.color.background02};
    border-radius: 36px;
    padding: 4px 12px 4px 6px;
    ${media.mobile} {
      top: 18px;
      right: 16px;
    }
  }
`;

export const IconButton = styled.div`
  ${mixins.flexbox("column", "center", "center")};
  height: 53px;
  min-width: 53px;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.color.background05};
  cursor: pointer;
  * {
    fill: ${({ theme }) => theme.color.icon05};
  }
`;
