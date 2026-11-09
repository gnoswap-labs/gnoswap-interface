import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";
import { media } from "@styles/media";
import mixins from "@styles/mixins";

export const LimitExpiryRow = styled.div`
  ${mixins.flexbox("row", "center", "space-between")};
  width: 100%;
  gap: 12px;
  padding: 12px 0 0;

  .expiry-label {
    ${fonts.body12};
    color: ${({ theme }) => theme.color.text02};
  }

  .tab-button {
    cursor: pointer;
    &:disabled {
      cursor: default;
    }
  }

  ${media.mobile} {
    flex-wrap: wrap;
    gap: 8px;
  }
`;
