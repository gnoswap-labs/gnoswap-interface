import styled from "@emotion/styled";
import mixins from "@styles/mixins";
import { fonts } from "@constants/font.constant";
import { media } from "@styles/media";

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
  flex: 1;
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
    flex: unset;
    width: 100%;
    height: 10px;
  }
`;
