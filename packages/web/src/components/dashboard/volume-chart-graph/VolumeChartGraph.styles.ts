import styled from "@emotion/styled";
import { fonts } from "@constants/font.constant";
import { media } from "@styles/media";
import mixins from "@styles/mixins";

export const VolumeChartGraphWrapper = styled.div`
  ${mixins.flexbox("column", "flex-start", "flex-start")};
  width: 100%;
  background-color: ${({ theme }) => theme.color.background01};
  border-radius: 8px;
  padding: 24px 24px 23px 24px;
  ${media.mobile} {
    padding: 24px 13px 27px 13px;
  }

  .data-wrapper {
    width: 100%;
    .graph-wrap {
      ${mixins.flexbox("column", "flex-start", "flex-start")};
      width: 100%;
    }

    .graph {
      border: 1px solid ${({ theme }) => theme.color.border02};
    }

    .xaxis-wrapper {
      ${mixins.flexbox("row", "center", "space-between")};
      width: 100%;
      height: 17px;
      flex-shrink: 0;
      margin-top: 16px;
      ${media.mobile} {
        height: 13px;
      }
      ${fonts.body12};
      color: ${({ theme }) => theme.color.text04};

      span {
        ${fonts.body12};
        ${media.mobile} {
          ${fonts.p6};
        }
        color: ${({ theme }) => theme.color.text04};
      }
    }
  }
`;
