import styled from "@emotion/styled";

import { fonts } from "@constants/font.constant";
import mixins from "@styles/mixins";

import { EarnAddConfirmContentSection } from "../pool-add-confirm-modal/PoolAddConfirmModal.styles";

export const PoolAddConfirmFeeInfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;

  p {
    ${fonts.body12}
    color: ${({ theme }) => theme.color.text10};
  }

  .title-wrapper {
    ${mixins.flexbox("row", "flex-start", "flex-start")};
    gap: 4px;

    svg {
      width: 16px;
      height: 16px;
      * {
        fill: ${({ theme }) => theme.color.icon03};
      }
    }
  }
`;

export const PoolAddConfirmFeeInfoSection = styled(
  EarnAddConfirmContentSection,
) <{ $hasError: boolean }>`
  height: 60px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  color: ${({ theme }) => theme.color.text01};
  background: ${({ theme }) => theme.color.background20};
  border: ${({ $hasError, theme }) => $hasError && `1px solid ${theme.color.red01}`};
  ${fonts.body9}
  margin-top: 8px;
  ${({ $hasError }) => $hasError ? "margin-bottom: 6px;" : ""};

  .token-info {
    display: flex;
    flex-direction: row;
    gap: 8px;
    align-items: center;

    span {
      height: 16px;
    }

    img {
      width: 24px;
      height: 24px;
    }
  }
`;

export const CreationFeeErrorMsgWrapper = styled.div`
  ${fonts.p3}
  color: ${({ theme }) => theme.color.red01}
`;

export const ToolTipContentWrapper = styled.div`
  width: 275px;
  ${fonts.body12}
  color: ${({ theme }) => theme.color.text02};
`;