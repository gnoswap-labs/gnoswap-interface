import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";
import { media } from "@styles/media";
import mixins from "@styles/mixins";

export const CardListWrapper = styled.div`
  ${mixins.flexbox("column", "center", "center")};
  width: 100%;
  gap: 24px;
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

export const GridWrapper = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto;
  grid-gap: 24px;
  grid-template-columns: repeat(4, 1fr);
  overflow-x: scroll;
  @media (max-width: 1000px) {
    overflow-x: auto;
    grid-gap: 12px;
    grid-template-columns: repeat(auto-fill, 322px);
    grid-auto-flow: column;
    grid-auto-columns: 322px;
  }

  .card-skeleton {
    height: 394px;
    border-radius: 10px;
    box-shadow: 8px 8px 20px 0px rgba(0, 0, 0, 0.2);
  }
  ${media.mobile} {
    overflow-x: auto;
    grid-gap: 12px;
    grid-template-columns: repeat(auto-fill, 290px);
    grid-auto-flow: column;
    grid-auto-columns: 290px;
  }
`;

export const BlankPositionCard = styled.div`
  min-width: 322px;
  ${media.mobile} {
    min-width: 290px;
  }
  border-radius: 10px;
  background: ${({ theme }) => theme.color.background08};
  box-shadow: ${({ theme }) => theme.color.shadow};
  border: 1px solid ${({ theme }) => theme.color.border14};
`;
