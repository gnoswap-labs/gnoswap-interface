import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";
import { media } from "@styles/media";
import mixins from "@styles/mixins";

interface Props {
  $loading: boolean;
}

export const IncentivizedWrapper = styled.div`
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

export const PoolListWrapper = styled.div<Props>`
  width: 100%;
  display: grid;
  grid-template-rows: auto;
  grid-gap: 24px;
  grid-template-columns: repeat(4, 1fr);
  overflow-x: scroll;
  @media (min-width: 1440px) {
    overflow-x: visible;
  }

  @media (max-width: 920px) {
    grid-gap: 12px;
    grid-template-columns: repeat(auto-fill, 290px);
    grid-auto-flow: column;
    grid-auto-columns: 322px;
  }

  .card-skeleton {
    height: 321px;
    border-radius: 10px;
    box-shadow: ${({ theme }) => theme.color.shadow02};
  }

  ${media.tablet} {
    grid-template-columns: repeat(3, 1fr);
  }
  ${media.mobile} {
    overflow-x: auto;
    grid-gap: 12px;
    grid-template-columns: repeat(auto-fill, 322px);
    grid-auto-flow: column;
    grid-auto-columns: 322px;
  }
`;

export const BlankIncentivizedCard = styled.div`
  min-width: 322px;
  ${media.mobile} {
    min-width: 290px;
  }
  border-radius: 10px;
  background: ${({ theme }) => theme.color.background08};
  box-shadow: ${({ theme }) => theme.color.shadow02};
  border: 1px solid ${({ theme }) => theme.color.border14};
`;
