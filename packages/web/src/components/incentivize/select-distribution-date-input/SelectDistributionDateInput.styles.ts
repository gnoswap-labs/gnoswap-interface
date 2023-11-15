import styled from "@emotion/styled";
import { fonts } from "@constants/font.constant";
import { media } from "@styles/media";

export const SelectDistributionDateInputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: auto;
  z-index: 3;

  & .description {
    ${fonts.p4}
    color: ${({ theme }) => theme.color.text04};
    margin-bottom: 4px;
  }

  & .date-wrapper {
    display: flex;
    width: 100%;
    height: 48px;
    padding: 0px 16px;
    gap: 8px;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    border-radius: 8px;
    border: 1px solid ${({ theme }) => theme.color.border02};
    background: ${({ theme }) => theme.color.background20};
    &:hover {
      background: ${({ theme }) => theme.color.background11};
    }
    cursor: pointer;

    & .icon-calender {
      width: 24px;
      height: 24px;
    }

    & .date {
      ${fonts.body9}
      color: ${({ theme }) => theme.color.text02};
    }
    ${media.mobile} {
      padding: 0 12px;
    }
  }

  & .calendar-container {
    position: relative;

    & .calendar-wrapper {
      position: absolute;
      top: 0;
      width: 100%;
      min-width: 315px;
      z-index: 10;
    }
  }
`;
