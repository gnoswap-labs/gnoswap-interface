import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";

export const SelectTokenBalanceWrapper = styled.div`
  position: relative;
  display: flex;
  width: 100%;
  padding: 4px 6px;
  gap: 8px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border-radius: 36px;
  border: 1px solid ${({ theme }) => theme.color.border02};
  background: ${({ theme }) => theme.color.backgroundOpacity};
  z-index: 2;

  .selected-wrapper {
    position: relative;
    display: flex;
    width: 100%;
    height: 100%;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;

    .logo {
      width: 24px;
      height: 24px;
    }

    .current {
      display: flex;
      flex-direction: row;
      width: 100%;
      height: 100%;
      justify-content: flex-start;
      align-items: center;
      gap: 8px;
      
      span {
        height: 20px;
        ${fonts.body8}
        color: ${({ theme }) => theme.color.text02};
      }
      
      span.symbol {
        color: ${({ theme }) => theme.color.text04};
      }
    }
  }

  .icon-arrow {
    width: 24px;
    height: 24px;
  }
`;

export const SelectTokenBalanceModalWrapper = styled.div`
  position: fixed;
  top: calc(50vh - 160px);
  left: calc(50vw - 230px);
  width: 460px;
  max-height: 320px;
  background-color: ${({ theme }) => theme.color.background06};
  border: 1px solid ${({ theme }) => theme.color.border02};
  border-radius: 8px;
  box-shadow: 10px 14px 60px 0px rgba(0, 0, 0, 0.4);
  z-index: 4;

  .modal-header {
    display: flex;
    flex-direction: row;
    width: 100%;
    padding: 24px 24px 16px 24px;
    color: ${({ theme }) => theme.color.text02};
    justify-content: space-between;
    align-items: center;

    .title {
      ${fonts.h6}
    }

    .icon-close {
      width: 24px;
      height: 24px;

      * {
        fill: ${({ theme }) => theme.color.text02};
      }
    }
  }
`;

export const SelectTokenBalanceItemWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  cursor: pointer;

  .info-wrapper {
    display: flex;
    flex-direction: row;
    gap: 8px;
    justify-content: flex-start;
    align-items: center;

    .logo {
      width: 24px;
      height: 24px;
    }
      
    span {
      height: 20px;
      ${fonts.body8}
      color: ${({ theme }) => theme.color.text02};
    }
    
    span.symbol {
      color: ${({ theme }) => theme.color.text04};
    }
  }
  
  .balance-wrapper {
    display: flex;
    justify-content: flex-start;
    align-items: center;

    .balance {
      height: 20px;
      ${fonts.body7}
      color: ${({ theme }) => theme.color.text02};
    }
  }
`;
