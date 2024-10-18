import styled from "@emotion/styled";
import { media } from "@styles/media";
import mixins from "@styles/mixins";

export const ActiveProjectsCardListWrapper = styled.div`
  ${mixins.flexbox("column", "center", "start")};
  width: 100%;
  gap: 24px;
  min-height: 240px;
  ${media.mobile} {
    gap: 16px;
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
  @media (max-width: 920px) {
    grid-gap: 12px;
    grid-template-columns: repeat(auto-fill, 322px);
    grid-auto-flow: column;
    grid-auto-columns: 322px;
  }

  .card-skeleton {
    min-width: 322px;
    height: 198px;
    border-radius: 10px;
    box-shadow: ${({ theme }) => theme.color.shadow02};
  }
`;
