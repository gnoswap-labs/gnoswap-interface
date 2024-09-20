import styled from "@emotion/styled";

import { fonts } from "@constants/font.constant";
import { media } from "@styles/media";
import mixins from "@styles/mixins";

export const StatusBadgeWrapper = styled.div`
  ${mixins.flexbox("row", "center", "center")};
  gap: 12px;
  ${media.mobile} {
    gap: 8px;
    ${mixins.flexbox("row", "flex-start", "flex-start")};
  }

  .status {
    flex-shrink: 0;
    ${mixins.flexbox("row", "center", "center")};
    gap: 6px;
    ${fonts.body11};

    .status-icon {
      ${mixins.flexbox("row", "center", "center")};
      width: 16px;
      height: 16px;
    }

    &.success {
      color: ${({ theme }) => theme.color.green01};
      .success-icon * {
        fill: ${({ theme }) => theme.color.green01};
      }
    }
    &.failed {
      color: ${({ theme }) => theme.color.red01};
      .failed-icon * {
        fill: ${({ theme }) => theme.color.red01};
      }
    }
    &.passed {
      color: ${({ theme }) => theme.color.background04};
      .passed-icon * {
        fill: ${({ theme }) => theme.color.background04};
      }
    }
    &.cancelled {
      color: ${({ theme }) => theme.color.icon03};
      .cancelled-icon * {
        fill: ${({ theme }) => theme.color.icon03};
      }
    }
  }

  .time {
    ${mixins.flexbox("row", "center", "center")};
    height: 18px;
    gap: 6px;
    ${fonts.p4};
    line-height: 18px;
    color: ${({ theme }) => theme.color.text05};
    * {
      fill: ${({ theme }) => theme.color.text05};
    }
  }
`;
