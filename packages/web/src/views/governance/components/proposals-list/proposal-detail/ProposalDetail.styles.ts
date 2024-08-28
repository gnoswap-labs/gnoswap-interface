import styled from "@emotion/styled";
import mixins from "@styles/mixins";
import { fonts } from "@constants/font.constant";
import { media } from "@styles/media";

export const ProposalDetailWrapper = styled.div`
  ${mixins.flexbox("column", "flex-start", "flex-start")};
  background-color: ${({ theme }) => theme.color.background03};
  border: 1px solid ${({ theme }) => theme.color.border01};
  cursor: pointer;
  border-radius: 8px;
  padding: 24px 36px;
  gap: 8px;
  width: 100%;
  box-shadow: 8px 8px 20px 0px rgba(0, 0, 0, 0.08);
  &:hover {
    background-color: ${({ theme }) => theme.color.hover01};
  }
  .header {
    ${mixins.flexbox("row", "center", "space-between")};
    flex-wrap: nowrap;
    width: 100%;
    gap: 8px;
    span {
      color: ${({ theme }) => theme.color.text12};
    }
    .title {
      ${fonts.body5};
      color: ${({ theme }) => theme.color.text02};
      overflow: hidden;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
    }

    .content {
      white-space: nowrap;
    }
  }
  ${media.mobile} {
    padding: 12px;
    gap: 12px;
    .header {
      .title {
        ${fonts.body11};
      }
    }
  }

  .active-wrapper {
    gap: 12px;
    ${mixins.flexbox("row", "center", "center")};
    ${media.mobile} {
      gap: 8px;
      ${mixins.flexbox("column", "flex-start", "flex-start")};
    }
  }

  .status {
    ${fonts.p4};
    ${mixins.flexbox("row", "center", "center")};
    ${media.mobile} {
      ${mixins.flexbox("row", "flex-start", "flex-start")};
    }
    gap: 6px;
    .status-icon {
      width: 16px;
      height: 16px;
    }
    .success-icon * {
      fill: ${({ theme }) => theme.color.green01};
    }
    .failed-icon * {
      fill: ${({ theme }) => theme.color.red01};
    }
    .passed-icon * {
      fill: ${({ theme }) => theme.color.background04};
    }
    .cancelled-icon * {
      fill: ${({ theme }) => theme.color.icon03};
    }
  }
  .success {
    color: ${({ theme }) => theme.color.green01};
  }
  .failed {
    color: ${({ theme }) => theme.color.red01};
  }
  .passed {
    color: ${({ theme }) => theme.color.background04};
  }
  .cancelled {
    color: ${({ theme }) => theme.color.icon03};
  }
  .time {
    color: ${({ theme }) => theme.color.text05};
  }
`;

export const ProgressWrapper = styled.div`
  ${mixins.flexbox("row", "center", "space-between")};
  width: 100%;
  gap: 24px;
  padding-top: 12px;
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
    ${mixins.flexbox("column", "start", "start")};
    gap: 8px;
    .progress-value {
      ${fonts.p6};
    }
  }
`;

export interface progressBarProps {
  rateWidth?: string;
  noOfQuorumWidth?: string;
  abstainOfQuorumWidth?: string;
}

export const ProgressBar = styled.div<progressBarProps>`
  ${mixins.flexbox("column", "flex-start", "center")};
  min-width: calc(100% - 200px);
  height: 14px;
  border-radius: 99px;
  background-color: ${({ theme }) => theme.color.background01};
  position: relative;
  .progress-bar-rate {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
  }
  .progress-bar-yes-of-quorum {
    z-index: 3;
    width: ${({ rateWidth }) => {
      return rateWidth ? rateWidth : "0%";
    }};
    height: 100%;
    border-radius: 8px;
    background-color: ${({ theme }) => theme.color.background04};
  }
  .progress-bar-no-of-quorum {
    z-index: 2;
    width: ${({ noOfQuorumWidth }) => {
      return noOfQuorumWidth ? noOfQuorumWidth : "0%";
    }};
    height: 100%;
    border-radius: 8px;
    background-color: ${({ theme }) => theme.color.background12};
  }

  ${media.mobile} {
    width: 100%;
    height: 10px;
  }
`;
