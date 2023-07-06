import styled from "@emotion/styled";
import mixins from "@styles/mixins";
import { fonts } from "@constants/font.constant";

export const WalletBalanceDetailInfoWrapper = styled.div`
  ${mixins.flexbox("column", "flex-start", "space-between")};
  padding: 24px 36px;
  width: 340px;
  & + & {
    border-left: 1px solid ${({ theme }) => theme.colors.gray50};
  }

  .title-wrapper {
    ${mixins.flexbox("row", "center", "center")};
    height: 18px;
    margin-bottom: 16px;

    .title {
      ${fonts.body12}
      color: ${({ theme }) => theme.colors.gray40};
      margin-right: 5px;
    }

    svg {
      width: 14px;
      height: 14px;
    }

    path {
      fill: ${({ theme }) => theme.colors.gray40};
    }
  }

  .value-wrapper {
    ${mixins.flexbox("row", "flex-end", "center")};

    .value {
      ${fonts.body2};
      color: ${({ theme }) => theme.colors.gray10};
    }
  }
`;

export const WalletBalanceDetailInfoTooltipContent = styled.div`
  ${mixins.flexbox("column", "flex-start", "flex-start")};
  width: calc(300px - 32px);
  ${fonts.body12};
  color: ${({ theme }) => theme.colors.brand10};
  background-color: ${({ theme }) => theme.colors.brand90};
`;
