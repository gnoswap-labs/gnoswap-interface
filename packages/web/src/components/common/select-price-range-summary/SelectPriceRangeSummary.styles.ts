import styled from "@emotion/styled";
import { fonts } from "@constants/font.constant";
import { media } from "@styles/media";

export const SelectPriceRangeSummaryWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: auto;
  padding: 16px;
  gap: 16px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.color.border02};
  background: ${({ theme }) => theme.color.background20};

  .row {
    display: flex;
    flex-direction: row;
    width: 100%;
    justify-content: space-between;
    align-items: center;

    .title-wrapper {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 4px;

      svg {
        width: 16px;
        height: 16px;
        cursor: pointer;
        * {
          fill: ${({ theme }) => theme.color.icon03};
        }
      }
    }

    .title {
      color: ${({ theme }) => theme.color.text04};
      ${fonts.body12};
    }

    .value {
      color: ${({ theme }) => theme.color.text03};
      ${fonts.body12};
    }
  }
  ${media.mobile} {
    padding: 11px;
    margin-top: 0;
    .row {
      flex-direction: column;
      align-items: flex-start;
      gap: 6px;
    }
  }
`;

export const ToolTipContentWrapper = styled.div`
  width: 268px;
  ${fonts.body12}
  color: ${({ theme }) => theme.color.text02};
`;
