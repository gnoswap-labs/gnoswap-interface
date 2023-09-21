import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";

export const EarnAddConfirmWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: auto;
  padding: 24px;
  gap: 16px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.color.border02};
  background-color: ${({ theme }) => theme.color.background06};
  box-shadow: 10px 14px 60px 0px rgba(0, 0, 0, 0.40);

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
