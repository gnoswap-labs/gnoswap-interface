import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";
import { media } from "@styles/media";
import mixins from "@styles/mixins";

export const StopOrderContent = styled.div`
  ${mixins.flexbox("column", "flex-start", "flex-start")};
  width: 100%;
  gap: 8px;

  .order-summary {
    ${mixins.flexbox("row", "center", "space-between")};
    width: 100%;
    gap: 8px;
    ${fonts.body9};
    color: ${({ theme }) => theme.color.text02};
    ${media.mobile} {
      ${fonts.body11};
    }
  }

  .order-status {
    ${mixins.flexbox("row", "center", "flex-start")};
    gap: 4px;
    ${fonts.p2};
    color: ${({ theme }) => theme.color.green01};
    &::before {
      content: "";
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background-color: ${({ theme }) => theme.color.green01};
    }
  }

  .order-heading {
    ${mixins.flexbox("row", "center", "flex-start")};
    gap: 8px;
    min-width: 0;
  }

  .token-amount {
    ${mixins.flexbox("row", "center", "flex-end")};
    gap: 6px;
  }
`;

export const ImportantNoteContent = styled.p`
  ${fonts.body12};
  ${media.mobile} {
    ${fonts.p2};
  }
`;
