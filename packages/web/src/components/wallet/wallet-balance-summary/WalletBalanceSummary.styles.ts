import styled from "@emotion/styled";
import mixins from "@styles/mixins";
import { ButtonStyleProps } from "@components/common/button/Button.styles";
import { fonts } from "@constants/font.constant";
import { ButtonHierarchy } from "@components/common/button/Button";

export const WalletBalanceSummaryWrapper = styled.div`
  ${mixins.flexbox("row", "center", "space-between")};
  padding: 36px;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.color.background11};
`;

export const BalanceInfoWrapper = styled.div`
  ${mixins.flexbox("column", "left", "space-between")};

  .title {
    margin-bottom: 16px;
    ${fonts.body4};
    color: ${({ theme }) => theme.color.text05};
  }

  .balance-info {
    ${mixins.flexbox("row", "center", "flex-start")};

    .amount {
      ${fonts.h3};
      color: ${({ theme }) => theme.color.text02};
    }
    .change-rate {
      margin-left: 16px;
      ${fonts.body3};
      color: ${({ theme }) => theme.color.text04};
    }
  }
`;

export const WalletButtonGroup = styled.div`
  ${mixins.flexbox("row", "center", "center")};
  gap: 8px;
  align-self: flex-end;

  .wallet-button-icon {
    margin-right: 8px;
  }
`;

export const defaultWalletButtonStyle: ButtonStyleProps = {
  width: 150,
  hierarchy: ButtonHierarchy.Primary,
  fontType: "body9",
  padding: "10px 16px",
};
