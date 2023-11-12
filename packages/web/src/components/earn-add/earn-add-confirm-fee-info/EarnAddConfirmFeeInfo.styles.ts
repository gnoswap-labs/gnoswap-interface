import styled from "@emotion/styled";
import { EarnAddConfirmContentSection } from "../earn-add-confirm/EarnAddConfirm.styles";
import { fonts } from "@constants/font.constant";

export const EarnAddConfirmFeeInfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 8px;

  p {
    ${fonts.body12}
    color: ${({ theme }) => theme.color.text10};
  }
`;

export const EarnAddConfirmFeeInfoSection = styled(
  EarnAddConfirmContentSection,
)`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  color: ${({ theme }) => theme.color.text01};
  background: ${({ theme }) => theme.color.background20};
  ${fonts.body9}

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
