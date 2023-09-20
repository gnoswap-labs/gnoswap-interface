import { fonts } from "@constants/font.constant";
import mixins from "@styles/mixins";

import styled from "@emotion/styled";

export const SetRewardAmountWrapper = styled.div`
  ${mixins.flexbox("column", "flex-start", "center")};
  width: 100%;
  gap: 16px;

  .input-wrapper {
    ${mixins.flexbox("column", "center", "space-between")};
    width: 100%;
    background-color: ${({ theme }) => theme.color.backgroundOpacity};
    border: 1px solid ${({ theme }) => theme.color.border02};
    border-radius: 8px;
    padding: 15px;
    height: 100%;
    gap: 5px;
  }

  .token-input-wrapper {
    display: flex;
    flex-direction: row;
    width: 100%;
    justify-content: center;
    align-items: center;
    gap: 8px;

    .token-selector {
      display: inline-flex;
      flex-shrink: 0;
      width: fit-content;
      min-width: 115px;
    }

    .amount {
      display: inline-flex;
      width: 100%;
      height: 100%;
      color: ${({ theme }) => theme.color.text01};
      ${fonts.body1};
      text-align: right;
    }
  }

  .balance-wrapper {
    display: flex;
    width: 100%;
    justify-content: flex-end;
    align-items: center;
    ${fonts.body12};
    color: ${({ theme }) => theme.color.text05};
  }
`;
