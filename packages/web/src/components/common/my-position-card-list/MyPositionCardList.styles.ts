import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";
import { media } from "@styles/media";
import mixins from "@styles/mixins";

interface Props {
  loading: boolean;
}

export const CardListWrapper = styled.div<Props>`
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

  .load-more-skeleton {
    width: 100%; 
    height: 18px;
  }
`;

export const GridWrapper = styled.div<Props>`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto;
  grid-gap: 24px;
  grid-template-columns: repeat(4, 1fr);
  /* overflow-x: hidden; */
  @media (max-width: 920px) {
    overflow-x: auto;
    grid-gap: 12px;
    grid-template-columns: repeat(auto-fill, 322px);
    grid-auto-flow: column;
    grid-auto-columns: 322px;
  }

  .card-skeleton {
    height: 198px;
    border-radius: 10px;
    box-shadow: ${({ theme }) => theme.color.shadow02};
  }
  ${media.tablet} {
    grid-template-columns: repeat(3, 1fr);
  }
  ${media.mobile} {
    overflow-x: auto;
    grid-gap: 12px;
    grid-template-columns: repeat(auto-fill, 100%);
    grid-auto-flow: column;
    grid-auto-columns: 100%;
  }
`;

export const BlankPositionCard = styled.div`
  min-width: 322px;
  ${media.mobile} {
    min-width: 290px;
  }
  border-radius: 10px;
  background: ${({ theme }) => theme.color.background08};
  box-shadow: ${({ theme }) => theme.color.shadow02};
  border: 1px solid ${({ theme }) => theme.color.border14};
`;
