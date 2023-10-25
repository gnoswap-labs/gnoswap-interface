import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";

export const EarnAddConfirmWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 460px;
  padding: 24px;
  height: auto;
  gap: 16px;

  .confirm-header {
    display: flex;
    flex-direction: row;
    width: 100%;
    justify-content: space-between;
    align-items: center;

    .title {
      ${fonts.h6}
      color: ${({ theme }) => theme.color.text01};
    }

    .close-button {
      svg {
        width: 24px;
        height: 24px; 
      }

      svg * {
        fill: ${({ theme }) => theme.color.icon01};
      }
    }
  }
`;

export const EarnAddConfirmContentSection = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: auto;
  padding: 16px;
  background-color: ${({ theme }) => theme.color.backgroundOpacity};
  border: 1px solid ${({ theme }) => theme.color.border02};
  border-radius: 8px;
  ${fonts.body12}

  .key {
    color: ${({ theme }) => theme.color.text04};
  }

  .value {
    color: ${({ theme }) => theme.color.text16};
  }
`;
