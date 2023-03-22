import styled from "@emotion/styled";
import mixins from "@/styles/mixins";

export const WalletBalanceSummaryInfoWrapper = styled.div`
  ${mixins.flexbox("row", "center", "flex-start")};

  .amount {
    ${({ theme }) => theme.fonts.h3};
    color: ${({ theme }) => theme.colors.gray10};
  }
  .change-rate {
    margin-left: 16px;
    ${({ theme }) => theme.fonts.body3};
    color: ${({ theme }) => theme.colors.gray40};
  }
`;
