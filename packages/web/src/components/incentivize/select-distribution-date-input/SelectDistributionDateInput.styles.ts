import styled from "@emotion/styled";
import { fonts } from "@constants/font.constant";
import { media } from "@styles/media";
import { Z_INDEX } from "@styles/zIndex";

export const SelectDistributionDateInputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: auto;
  z-index: 3;
  ${media.mobile} {
    z-index: auto;
  }

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
      max-height: 0;
      top: 5px;
      width: 100%;
      min-width: 315px;
      z-index: 10;
      max-height: 0;
      display: none;
      ${media.mobile} {
        transition: max-height 0.5s ease;
        position: fixed;
        top: auto;
        bottom: 0;
        width: 100vw;
        min-width: 360px;
        left: 0;
        z-index: ${Z_INDEX.fixed};
        display: block;
      }
    }
    & .open {
      display: block;
      max-height: 305px;
      ${media.mobile} {
      max-height: 305px;
      }
    }
  }
`;
