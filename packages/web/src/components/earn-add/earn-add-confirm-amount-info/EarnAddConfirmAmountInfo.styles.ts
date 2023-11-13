import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";
import { media } from "@styles/media";
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
    .token {
      > div {
        padding-top: 5px;
        padding-bottom: 5px;
        height: auto;
      }
      .token-symbol {
        ${fonts.body9}
        margin-right: 6px;
        height: 100%;
        margin-left: 0;
      }
    }
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
      background-color: ${({ theme }) => theme.color.background20};
      border: 1px solid ${({ theme }) => theme.color.border02};

      svg {
        width: 16px;
        height: 16px;
        * {
          fill: ${({ theme }) => theme.color.text01};
        }
      }
    }
  }
`;

export const EarnAddConfirmFeeInfoSection = styled(
  EarnAddConfirmContentSection,
)`
  height: 50px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  .value {
    color: ${({ theme }) => theme.color.text03};
  }
  ${media.mobile} {
    height: 42px;
  }
`;
