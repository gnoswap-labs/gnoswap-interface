import styled from "@emotion/styled";
import { media } from "@styles/media";

interface Props {
  $loading: boolean;
}

export const GridWrapper = styled.div<Props>`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto;
  grid-gap: 24px;
  grid-template-columns: repeat(4, 1fr);
  overflow: scroll;
  @media (max-width: 1430px) {
    overflow-x: visible;
  }
  ${media.tablet} {
    grid-template-columns: repeat(3, 1fr);
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
