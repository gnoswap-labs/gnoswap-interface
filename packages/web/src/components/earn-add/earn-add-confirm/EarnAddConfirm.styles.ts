import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";
import { media } from "@styles/media";

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
      ${media.mobile} {
      ${fonts.body9}
      }
    }

    .close-button {
      svg {
        width: 24px;
        height: 24px; 
      }

      svg * {
        fill: ${({ theme }) => theme.color.icon01};
      }
      &:hover {
        * {
          fill: ${({ theme }) => theme.color.icon07};
        }
      }
    }
  }
  .button-confirm {
    gap: 8px;
    height: 57px;
    span {
      ${fonts.body7}
    }
    
  }
  ${media.mobile} {
    width: 328px;
    padding: 16px 12px;
    span {
      ${fonts.body7}
    }
    .button-confirm {
      height: 41px;
      span {
        ${fonts.body9}
      }
    }
  }
`;

export const EarnAddConfirmContentSection = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: auto;
  padding: 15px;
  background-color: ${({ theme }) => theme.color.background20};
  border: 1px solid ${({ theme }) => theme.color.border02};
  border-radius: 8px;
  ${fonts.body12}

  .key {
    color: ${({ theme }) => theme.color.text04};
  }

  .value {
    color: ${({ theme }) => theme.color.text16};
  }
  ${media.mobile} {
    padding: 11px;
  }
`;
