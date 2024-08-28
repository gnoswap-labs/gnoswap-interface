import mixins from "@styles/mixins";
import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";
import { Z_INDEX } from "@styles/zIndex";
import { media } from "@styles/media";

export const ViewProposalModalBackground = styled.div`
  position: fixed;
  overflow: scroll;
  top: 0px;
  bottom: 0px;
  left: 0px;
  right: 0px;
  width: 100%;
  height: 100lvh;
  z-index: ${Z_INDEX.modal};
  pointer-events: none;
`;

export const ViewProposalModalWrapper = styled.div`
  pointer-events: initial;
  position: absolute;
  overflow: hidden;
  width: 700px;
  border-radius: 8px;
  padding: 24px 0px;
  gap: 16px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 10px 14px 60px 0px rgba(0, 0, 0, 0.4);
  border: 1px solid ${({ theme }) => theme.color.border02};
  background-color: ${({ theme }) => theme.color.background06};
  ${media.mobile} {
    width: 328px;
    height: 610px;
    padding: 16px 12px 0px 12px;
    transform: translate(-50%, -50%);
  }
  .modal-body {
    ${mixins.flexbox("column", "flex-start", "flex-start")};
    width: 100%;
    padding: 0px 24px;
    gap: 16px;
    ${media.mobile} {
      padding: 0px;
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
    width: 100%;
    ${mixins.flexbox("row", "center", "space-between")};
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

export const BoxQuorumWrapper = styled.div`
  ${mixins.flexbox("row", "center", "center")};
  width: 100%;
  gap: 2px;
  .box-quorum {
    ${mixins.flexbox("column", "center", "center")};
    gap: 8px;
    cursor: pointer;
    position: relative;
    padding: 15px 8px;
    border-radius: 8px;
    flex: 1;
    background-color: ${({ theme }) => theme.color.backgroundOpacity2};
    border: 1px solid ${({ theme }) => theme.color.border02};
    span {
      color: ${({ theme }) => theme.color.text10};
      ${fonts.body12}
    }
    > div:first-of-type {
      ${fonts.body4}
      color: ${({ theme }) => theme.color.text02};
    }
    .badge {
      > span {
        color: ${({ theme }) => theme.color.text12};
      }
      position: absolute;
      top: 8px;
      right: 12px;
    }
    ${media.mobile} {
      ${mixins.flexbox("column", "flex-start", "flex-start")};
      padding: 12px;
      > div {
        ${fonts.body11}
      }

      > div:first-of-type {
        ${fonts.body12}
      }
    }
    &:hover {
      background-color: ${({ theme }) => theme.color.background05Hover};
      border: 1px solid ${({ theme }) => theme.color.border03};
    }
  }
  .active-quorum {
    background-color: ${({ theme }) => theme.color.background05Hover};
    border: 1px solid ${({ theme }) => theme.color.border03};
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
    gap: 16px;
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

  .title {
    ${fonts.body7}
    color: ${({ theme }) => theme.color.text01};
    ${media.mobile} {
      ${fonts.body11}
    }
  }
  .content {
    color: ${({ theme }) => theme.color.text04};
    ${fonts.body12}
    ${media.mobile} {
      ${fonts.p2}
    }
  }
  ${media.mobile} {
    padding: 12px 4px 12px 12px;
    gap: 8px;
  }
`;
