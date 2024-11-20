import styled from "@emotion/styled";

import { fonts } from "@constants/font.constant";
import { media } from "@styles/media";
import mixins from "@styles/mixins";

export const ProposalListWrapper = styled.div`
  ${mixins.flexbox("column", "flex-start", "flex-start")};
  width: 100%;
  gap: 16px;

  .no-data-found {
    width: 100%;
    ${mixins.flexbox("row", "center", "center")};
    padding: 60px 0;
    ${fonts.body12}
    color: ${({ theme }) => theme.color.text04};
    ${media.mobile} {
      padding: 12px 0;
      ${fonts.p4}
    }
  }
`;
