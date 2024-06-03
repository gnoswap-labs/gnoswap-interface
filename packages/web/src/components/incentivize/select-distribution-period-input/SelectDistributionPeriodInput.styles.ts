import styled from "@emotion/styled";
import { fonts } from "@constants/font.constant";

export const SelectDistributionPeriodInputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: auto;
  & .description {
    ${fonts.p4}
    color: ${({ theme }) => theme.color.text04};
    margin-bottom: 4px;
  }

  & .period-wrapper {
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
    background: ${({ theme }) => theme.color.background20};

    & .icon-arrow {
      width: 16px;
      height: 16px;
    }
    
    & .period {
      height: 16px;
      ${fonts.body9}
      color: ${({ theme }) => theme.color.text02};
    }
  }
`;

export const PoolIncentivizeSelectPeriodBox = styled.div`
  position: absolute;
  top: 53px;
  left: 0;
  width: 100%;
  background-color: ${({ theme }) => theme.color.background06};
  border: 1px solid ${({ theme }) => theme.color.border02};
  border-radius: 8px;
  box-shadow: 10px 14px 60px 0px rgba(0, 0, 0, 0.4);
`;

export const PoolIncentivizeSelectPeriodBoxItem = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  padding: 8px 24px;
  color: ${({ theme }) => theme.color.text02};
  ${fonts.body12}
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme.color.hover02};
  }
`;
