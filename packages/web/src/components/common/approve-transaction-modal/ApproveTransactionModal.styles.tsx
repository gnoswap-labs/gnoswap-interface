import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";
import { media } from "@styles/media";

export const ApproveTransactionModalWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  flex-direction: column;
  gap: 16px;

  position: relative;
  pointer-events: initial;

  width: 460px;
  padding: 24px 0;

  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.color.border02};

  ${media.mobile} {
    width: 328px;
    padding: 16px 0;
  }
`;

export const ApproveTransactionModalBody = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  flex-direction: column;
  gap: 16px;

  width: 100%;
  padding: 0 24px;

  ${media.mobile} {
    padding: 0 16px;
  }
`;

export const ApproveTransactionModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  .title {
    color: ${({ theme }) => theme.color.text02};
    ${fonts.body7};
    font-weight: 600;
    ${media.mobile} {
      ${fonts.body9}
    }
  }
  .close-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    button {
      font-size: 0;
    }
    .close-icon {
      width: 24px;
      height: 24px;
      * {
        fill: ${({ theme }) => theme.color.icon01};
      }
      &:hover {
        * {
          fill: ${({ theme }) => theme.color.icon07};
        }
      }
    }
  }
`;

export const ApproveTransactionModalContents = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
`;

export const ApproveTransactionSummary = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;

  width: 100%;
`;

interface InfoCardProps {
  justify?: "center" | "space-between";
  gap?: number;
  flexDirection?: "row" | "column";
}
export const InfoCard = styled.div<InfoCardProps>`
  display: flex;
  align-items: center;
  justify-content: ${({ justify = "space-between" }) => justify};
  flex-direction: ${({ flexDirection = "row" }) => flexDirection};
  gap: ${({ gap = 0 }) => `${gap}px`};

  color: ${({ theme }) => theme.color.text01};
  width: 100%;
  padding: 16px;
  background-color: ${({ theme }) => theme.color.border12};

  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.color.border02};
  .flex-box {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
  }
  .label {
    color: ${({ theme }) => theme.color.border05};
    font-weight: 400;
  }
  .value {
    color: ${({ theme }) => theme.color.text01};
    font-weight: 500;
    input {
      text-align: right;
      &::placeholder {
        color: ${({ theme }) => theme.color.text04};
      }
    }
  }
`;

export const ApproveTransactionDetails = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;

  button {
    color: ${({ theme }) => theme.color.text04};
    font-size: 14px;
    font-weight: 400;
    margin: 8px 0;
  }
  .transaction-messages {
    width: 100%;
    border-radius: 8px;
    border: 1px solid transparent;
    background-color: transparent;
    overflow: scroll;
    transition: all 0.3s ease-in-out;
    &.expanded {
      border: 1px solid ${({ theme }) => theme.color.border02};
      background-color: ${({ theme }) => theme.color.border12};
    }
    .json-viewer {
      margin: 0;
      padding: 16px;
      white-space: pre-wrap;
      word-break: break-all;
      font-size: 14px;
      font-weight: 500;
      color: ${({ theme }) => theme.color.text01};
      overflow-y: scroll;
      /* width: 100%; */
    }
  }
`;

export const ApproveTransactionButtonWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  gap: 16px;
`;
