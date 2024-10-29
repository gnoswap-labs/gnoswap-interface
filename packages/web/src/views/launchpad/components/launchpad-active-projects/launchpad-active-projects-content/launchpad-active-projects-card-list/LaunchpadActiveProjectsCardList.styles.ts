import styled from "@emotion/styled";
import { media } from "@styles/media";
import mixins from "@styles/mixins";
import { fonts } from "@constants/font.constant";

export const ActiveProjectsCardListWrapper = styled.div`
  ${mixins.flexbox("column", "center", "start")};
  width: 100%;
  gap: 24px;
  min-height: 240px;
  ${media.mobile} {
    gap: 16px;
  }
  .box-indicator {
    ${mixins.flexbox("row", "center", "center")};
    width: 100%;
    gap: 4px;
    span {
      color: ${({ theme }) => theme.color.text04};
      ${fonts.body12};
    }
    .current-page {
      color: ${({ theme }) => theme.color.text05};
    }
  }
`;

export const ActiveProjectsGridWrapper = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto;
  grid-gap: 24px;
  grid-template-columns: repeat(2, 1fr);
  overflow: scroll;
  @media (max-width: 1430px) {
    overflow-x: visible;
  }
  ${media.tablet} {
    grid-template-columns: repeat(2, 1fr);
  }
  ${media.mobile} {
    grid-gap: 12px;
    grid-template-columns: repeat(auto-fill, 328px);
    grid-auto-flow: column;
    grid-auto-columns: 328px;
  }

  .card-skeleton {
    min-width: 322px;
    height: 317px;
    border-radius: 10px;
  }
`;
