import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";

export const SelectBoxWrapper = styled.div`
  position: relative;
  display: flex;
  width: 100%;
  height: 48px;
  padding: 0px 16px;
  gap: 8px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.color.border02};
  background: ${({ theme }) => theme.color.backgroundOpacity};
  z-index: 3;

  .selected-wrapper {
    position: relative;
    display: flex;
    width: 100%;
    height: 100%;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
  }

  .icon-arrow {
    width: 16px;
    height: 16px;
  }
    
  .current {
    ${fonts.body9}
    color: ${({ theme }) => theme.color.text02};
  }
`;

export const SelectBoxModalWrapper = styled.div`
  position: absolute;
  top: 53px;
  left: 0;
  width: 100%;
  background-color: ${({ theme }) => theme.color.background06};
  border: 1px solid ${({ theme }) => theme.color.border02};
  border-radius: 8px;
  box-shadow: 10px 14px 60px 0px rgba(0, 0, 0, 0.4);
  z-index: 4;
`;
