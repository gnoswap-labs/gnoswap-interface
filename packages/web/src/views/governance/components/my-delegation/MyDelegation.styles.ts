import styled from "@emotion/styled";

import { fonts } from "@constants/font.constant";
import { media } from "@styles/media";
import mixins from "@styles/mixins";

export const MyDelegationWrapper = styled.div`
  ${mixins.flexbox("column", "center", "flex-start")};
  width: 100%;
  gap: 24px;

  > .my-delegation-title {
    width: 100%;
    ${fonts.h5}
    color: ${({ theme }) => theme.color.text02};
    ${media.mobile} {
      ${fonts.h6};
    }
  }

  > .info-wrapper {
    ${mixins.flexbox("row", "flex-start", "flex-start")};
    width: 100%;
    border-radius: 8px;
    background-color: ${({ theme }) => theme.color.background06};
    border: 1px solid ${({ theme }) => theme.color.border02};
    @media (max-width: 968px) {
      ${mixins.flexbox("column", "flex-start", "flex-start")};
    }
    ${media.mobile} {
      flex-direction: column;
    }

    > .require-wallet {
      ${mixins.flexbox("column", "center", "center")};
      width: 100%;
      padding: 30.5px 0;
      gap: 20px;

      button {
        flex-shrink: 0;
        padding: 10px 16px;
      }
    }
  }
`;

export const MyDelegationTooltipContent = styled.div`
  ${mixins.flexbox("column", "flex-start", "flex-start")};
  width: 300px;
  ${fonts.body12};
  gap: 8px;

  > .delegation-item {
    ${mixins.flexbox("column", "flex-start", "flex-start")};
    width: 100%;
    gap: 8px;

    > .divider {
      height: 1px;
      width: 100%;
      background-color: ${({ theme }) => theme.color.border01};
    }

    > .info-row {
      ${mixins.flexbox("row", "center", "space-between")};
      height: 26px;
      width: 100%;

      > .info-subject {
        color: ${({ theme }) => theme.color.text04};
      }

      > .info-value {
        ${mixins.flexbox("row", "center", "center")};
        gap: 4px;
        color: ${({ theme }) => theme.color.text02};
      }
    }
  }
`;