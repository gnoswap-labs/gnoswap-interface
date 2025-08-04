import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";
import { media } from "@styles/media";

export const TransactionApprovalModalWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  flex-direction: column;
  gap: 16px;
  overflow-y: auto;

  position: relative;
  pointer-events: initial;

  width: 460px;
  max-height: calc(100dvh - 150px);
  padding: 24px 0;

  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.color.border02};

  ${media.mobile} {
    width: 328px;
    padding: 16px 0;
  }
`;

export const TransactionApprovalModalBody = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  flex-direction: column;
  gap: 16px;

  width: 100%;
  padding: 0 24px;

  ${media.mobile} {
    padding: 0 16px;
    font-size: 14px;
  }
`;

export const TransactionApprovalModalHeader = styled.div`
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

export const TransactionApprovalModalContents = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
`;

export const TransactionApprovalSummary = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;

  width: 100%;
  .error-text {
    color: ${({ theme }) => theme.color.red01};
    font-size: 14px;

    display: flex;
    justify-content: flex-start;
    width: 100%;
    margin-bottom: 4px;
    ${media.mobile} {
      font-size: 12px;
    }
  }
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
  background-color: ${({ theme }) => (theme.themeKey === "dark" ? theme.color.border12 : "#FFF")};

  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.color.border02};
  &.red {
    border: 1px solid ${({ theme }) => theme.color.red01};
  }
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
    display: flex;
    align-items: center;
    gap: 8px;

    color: ${({ theme }) => theme.color.text01};
    font-weight: 500;

    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    max-width: 300px;

    span {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      max-width: 100%;
      flex: 1;
    }
    input {
      text-align: right;
      &::placeholder {
        color: ${({ theme }) => theme.color.text04};
      }
    }
    svg {
      width: 18px;
      height: 18px;
    }
  }
`;

export const TransactionApprovalDetails = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;

  button {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    color: ${({ theme }) => theme.color.text04};
    font-size: 14px;
    font-weight: 400;
    margin: 8px 0 0;
    * {
      fill: ${({ theme }) => theme.color.text04};
    }
    ${media.mobile} {
      font-size: 12px;
    }
  }
  .transaction-messages {
    width: 100%;
    border-radius: 8px;
    border: 0px solid transparent;
    background-color: transparent;
    overflow: scroll;
    transition: max-height 0.3s ease-in-out, border 0.3s ease-in-out;
    margin-top: 0px;
    &.expanded {
      margin-top: 8px;
      border: 1px solid ${({ theme }) => theme.color.border02};
      background-color: ${({ theme }) => (theme.themeKey === "dark" ? theme.color.border12 : "#FFF")};
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

export const TransactionApprovalButtonWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  gap: 16px;
  ${media.mobile} {
    button {
      height: 41px;
      span {
        font-size: 16px;
      }
    }
  }
`;
