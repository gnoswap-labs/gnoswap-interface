import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";
import { media } from "@styles/media";
import mixins from "@styles/mixins";

export const StakingHeaderWrapper = styled.div`
  ${mixins.flexbox("row", "flex-end", "space-between")};
  width: 100%;
  color: ${({ theme }) => theme.color.text02};
  ${fonts.h5};
  ${media.mobile} {
    ${fonts.h6};
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    gap: 16px;
  }
  .left-wrap {
    ${mixins.flexbox("row", "center", "flex-start")};
    gap: 20px;
    .logo-wrap {
      ${mixins.flexbox("row", "center", "flex-start")};
      gap: 4px;
      margin-top: 7px;
      margin-bottom: 4px;
      cursor: pointer;
      .lean-more {
        ${fonts.body11};
        color: ${({ theme }) => theme.color.text04};
      }
      .icon-logo {
        width: 16px;
        height: 16px;
        cursor: pointer;
        * {
          fill: ${({ theme }) => theme.color.icon03};
        }
      }
      &:hover {
        .lean-more {
          color: ${({ theme }) => theme.color.text03};
        }
        svg {
          * {
            fill: ${({ theme }) => theme.color.icon07};
          }
        }
      }
    }
    ${media.tablet} {
      gap: 12px;
    }
    ${media.mobile} {
      gap: 10px;
      .logo-wrap {
        margin-top: 4px;
        margin-bottom: 0px;
      }
    }
  }
  .button-wrap {
    ${mixins.flexbox("row", "center", "center")};
    gap: 8px;
    ${media.mobile} {
      width: 100%;
    }
  }
`;
