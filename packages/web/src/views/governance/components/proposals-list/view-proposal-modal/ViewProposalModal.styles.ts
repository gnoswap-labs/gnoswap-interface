import styled from "@emotion/styled";

import mixins from "@styles/mixins";
import { fonts } from "@constants/font.constant";
import { media } from "@styles/media";

export const ViewProposalModalWrapper = styled.div`
  overflow: scroll;
  width: 700px;
  border-radius: 8px;
  padding: 24px 0px;
  gap: 16px;
  box-shadow: 10px 14px 60px 0px rgba(0, 0, 0, 0.4);
  border: 1px solid ${({ theme }) => theme.color.border02};
  background-color: ${({ theme }) => theme.color.background06};
  ${media.mobile} {
    width: 328px;
    height: 610px;
    padding: 16px 12px 0px 12px;
  }
  .modal-body {
    ${mixins.flexbox("column", "flex-start", "flex-start")};
    width: 100%;
    padding: 0px 24px;
    gap: 16px;
    ${media.mobile} {
      padding: 0 0 12px 0;
    }
  }
`;

export const ModalHeaderWrapper = styled.div`
  ${mixins.flexbox("column", "flex-start", "flex-start")};
  gap: 8px;
  width: 100%;
  ${media.mobile} {
    gap: 12px;
  }
  .header {
    ${mixins.flexbox("row", "center", "space-between")};
    gap: 8px;
    width: 100%;
    .title {
      color: ${({ theme }) => theme.color.text02};
      ${mixins.flexbox("row", "center", "space-between")};
      gap: 12px;
      ${fonts.h6}
      ${media.mobile} {
        ${fonts.body9}
      }
    }
    .badge-label {
      flex-shrink: 0;
      color: ${({ theme }) => theme.color.text12};
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
  }
  .active-wrapper {
    gap: 12px;
    ${mixins.flexbox("row", "center", "center")};
    ${media.mobile} {
      margin-top: 4px;
      ${mixins.flexbox("column", "flex-start", "flex-start")};
      gap: 8px;
    }
  }
`;

export const ProposalContentWrapper = styled.div`
  ${mixins.flexbox("column", "flex-start", "flex-start")};
  width: 100%;
  border: 1px solid ${({ theme }) => theme.color.border02};
  height: 335px;
  overflow: scroll;
  padding: 24px;
  gap: 12px;
  border-radius: 8px;
  &::-webkit-scrollbar {
    width: 8px;
    display: block;
    height: 0;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
    padding: 0;
    height: 0;
    display: none;
  }

  &::-webkit-scrollbar-thumb {
    background-color: ${({ theme }) => theme.color.background12};
    border-radius: 8px;
    padding: 0;
  }

  .content {
    color: ${({ theme }) => theme.color.text04};
    ${fonts.body12}
    ${media.mobile} {
      ${fonts.p2}
    }
    white-space: pre-wrap !important;

    .variable {
      margin-bottom: 12px;
      .variable-type {
        ${fonts.body11}
        color: ${({ theme }) => theme.color.text03};
        margin-bottom: 12px;
      }
    }
  }
  ${media.mobile} {
    padding: 12px 4px 12px 12px;
    gap: 8px;
  }
`;

export const ModalQuorum = styled.div`
  ${mixins.flexbox("column", "flex-start", "flex-start")};
  width: 100%;
  border: 1px solid ${({ theme }) => theme.color.border02};
  padding: 16px;
  border-radius: 8px;
  ${media.mobile} {
    padding: 12px;
    gap: 10px;
  }
  .quorum-header {
    width: 100%;
    ${mixins.flexbox("row", "center", "space-between")};
    ${fonts.body12};
    ${media.mobile} {
      ${fonts.p4};
    }
    span {
      color: ${({ theme }) => theme.color.text04};
    }
    .progress-value {
      ${mixins.flexbox("row", "center", "center")};
      flex-wrap: wrap;
      gap: 4px;
      color: ${({ theme }) => theme.color.text04};
      ${fonts.body12};
      span {
        color: ${({ theme }) => theme.color.text10};
      }
    }
    ${media.mobile} {
      gap: 8px;
      .progress-value {
        ${fonts.p6};
      }
    }
  }
`;

export const VotingPowerWrapper = styled.div`
  ${mixins.flexbox("row", "center", "space-between")};
  background-color: ${({ theme }) => theme.color.backgroundOpacity2};
  border: 1px solid ${({ theme }) => theme.color.border02};
  padding: 16px;
  width: 100%;
  border-radius: 8px;
  > span {
    ${fonts.body12}
    color: ${({ theme }) => theme.color.text10};
  }
  > div {
    ${mixins.flexbox("row", "center", "center")};
    color: ${({ theme }) => theme.color.text01};
  }
  .power-value {
    ${fonts.body3}
  }
  ${media.mobile} {
    padding: 12px;
    > div {
      gap: 8px;
    }
    .power-value {
      ${fonts.body11}
    }
  }
`;
