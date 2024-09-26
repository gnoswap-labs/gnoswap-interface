import styled from "@emotion/styled";

import { fonts } from "@constants/font.constant";
import { media } from "@styles/media";
import mixins from "@styles/mixins";

export const MyDelegationWrapper = styled.div`
  ${mixins.flexbox("column", "center", "flex-start")};
  width: 100%;
  gap: 24px;

  ${media.mobile} {
    gap: 16px;
  }

  > .header-wrapper {
    width: 100%;
    ${mixins.flexbox("row", "center", "space-between")};

    > .my-delegation-title {
      width: 100%;
      ${fonts.h5}
      color: ${({ theme }) => theme.color.text02};
      ${media.mobile} {
        ${fonts.h6};
      }
    }

    > .delegate-buttons {
      ${mixins.flexbox("row", "center", "flex-end")};
      gap: 8px;
      button {
        flex-shrink: 0;
        padding: 10px 16px;
      }
    }

    ${media.mobile} {
      flex-direction: column;
      gap: 16px;
      > .delegate-buttons {
        width: 100%;
        button {
          flex: 1;
        }
      }
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

    .del-undel-switch {
      ${mixins.flexbox("row", "center", "center")};
      gap: 4px;
    }

    .value-wrapper-for-hover {
      ${mixins.flexbox("row", "center", "flex-start")};
      &:hover {
        color: ${({ theme }) => theme.color.text07};
        cursor: default;
      }
    }

    > .require-wallet {
      ${mixins.flexbox("column", "center", "center")};
      width: 100%;
      padding: 20px 12px 23px;
      gap: 18px;
      background-color: ${({ theme }) => theme.color.background11};

      ${fonts.body8}
      color: ${({ theme }) => theme.color.text22};
      text-align: center;

      ${media.tablet} {
        ${fonts.body10}
      }
      ${media.mobile} {
        ${fonts.body12}
      }

      .unconnected-icon {
        width: 50px;
        height: 50px;
        * {
          fill: ${({ theme }) => theme.color.icon03};
        }
        ${media.mobile} {
          width: 36px;
          height: 36px;
        }
      }

      button {
        > span {
          ${fonts.body7}
        }
        width: 200px;
        height: 46px;
        ${media.mobile} {
          > span {
            ${fonts.body9}
          }
          height: 41px;
          width: 100%;
        }
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

  .no-data {
    width: 100%;
    ${mixins.flexbox("column", "center", "center")};
    color: ${({ theme }) => theme.color.text04};
  }
`;