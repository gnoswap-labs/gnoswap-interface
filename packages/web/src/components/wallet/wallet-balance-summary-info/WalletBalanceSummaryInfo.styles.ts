import styled from "@emotion/styled";
import mixins from "@styles/mixins";
import { fonts } from "@constants/font.constant";

export const WalletBalanceSummaryInfoWrapper = styled.div`
  ${mixins.flexbox("row", "center", "flex-start")};

  .amount {
    ${fonts.h3};
    color: ${({ theme }) => theme.colors.gray10};
  }
  .change-rate {
    margin-left: 16px;
    ${fonts.body3};
    color: ${({ theme }) => theme.colors.gray40};
  }
`;
