import styled from "@emotion/styled";
import mixins from "@styles/mixins";
import { ButtonStyleProps } from "@components/common/button/Button.styles";
import { fonts } from "@constants/font.constant";

export const WalletBalanceSummaryWrapper = styled.div`
  ${mixins.flexbox("row", "center", "space-between")};
  padding: 36px;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.colors.gray60};
`;

export const BalanceInfoWrapper = styled.div`
  ${mixins.flexbox("column", "left", "space-between")};

  .title {
    margin-bottom: 16px;
    ${fonts.body4};
    color: ${({ theme }) => theme.colors.gray30};
  }

  .balance-info {
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
  }
`;

export const WalletButtonGroup = styled.div`
  ${mixins.flexbox("row", "center", "center")};
  gap: 8px;
  align-self: flex-end;
`;

export const defaultWalletButtonStyle: ButtonStyleProps = {
  width: 150,
  padding: "10px 16px",
};
