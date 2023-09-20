import styled from "@emotion/styled";
import { EarnAddConfirmContentSection } from "../earn-add-confirm/EarnAddConfirm.styles";

export const EarnAddConfirmAmountInfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: auto;
  gap: 2px;

  .pair-amount {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;
    height: auto;
    gap: 2px;

    .icon-wrapper {
      position: absolute;
      display: flex;
      left: calc(50% - 20px);
      top: calc(50% - 20px);
      width: 40px;
      height: 40px;
      justify-content: center;
      align-items: center;
      border-radius: 40px;
      background-color: ${({ theme }) => theme.color.background01};
      border: 1px solid ${({ theme }) => theme.color.border02};

      svg {
        width: 16px;
        height: 16px;
      }
    }
  }
`;

export const EarnAddConfirmFeeInfoSection = styled(
  EarnAddConfirmContentSection,
)`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;
