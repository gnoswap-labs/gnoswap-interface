import styled from "@emotion/styled";
import { fonts } from "@constants/font.constant";

export const SelectDistributionPeriodInputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: auto;
  z-index: 3;

  & .title {
    ${fonts.p4}
    color: ${({ theme }) => theme.color.text04};
  }

  & .date-wrapper {
    display: flex;
    width: 100%;
    height: 48px;
    padding: 0px 16px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-radius: 8px;
    border: 1px solid ${({ theme }) => theme.color.border02};
    background: ${({ theme }) => theme.color.backgroundOpacity};

    & .date {
      ${fonts.body9}
      color: ${({ theme }) => theme.color.text02};
    }
  }

  & .calendar-container {
    position: relative;

    & .calendar-wrapper {
      position: absolute;
      top: 0;
      width: 315px;
      z-index: 10;
    }
  }
`;
