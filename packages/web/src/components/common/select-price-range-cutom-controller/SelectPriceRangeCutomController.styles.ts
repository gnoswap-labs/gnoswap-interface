import styled from "@emotion/styled";
import { fonts } from "@constants/font.constant";

export const SelectPriceRangeCutomControllerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  border-radius: 8px;
  padding: 16px 8px;
  border: 1px solid ${({ theme }) => theme.color.border02};
  justify-content: center;
  align-items: center;
  gap: 8px;

  .title {
    color: ${({ theme }) => theme.color.text05};
    ${fonts.body12};
  }

  .controller-wrapper {
    display: flex;
    width: 100%;
    justify-content: space-between;
    align-items: center;

    .icon-wrapper {
      display: flex;
      flex-shrink: 0;
      padding: 2px;
      width: 28px;
      height: 28px;
      border-radius: 4px;
      justify-content: center;
      align-items: flex-start;
      color: ${({ theme }) => theme.color.icon05};
      ${fonts.body6}
      line-height: 22px;
      cursor: pointer;
    }

    .value-wrapper {
      ${fonts.body4}
    }
  }

  .token-info-wrapper {
    color: ${({ theme }) => theme.color.text05};
    ${fonts.p4}
  }
`;
