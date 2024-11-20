import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";
import { media } from "@styles/media";
import mixins from "@styles/mixins";

export const ProposalHeaderWrapper = styled.div`
  ${mixins.flexbox("row", "center", "space-between")};
  width: 100%;
  ${media.mobile} {
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    gap: 24px;
  }
  > .header-title {
    width: 100%;
    flex: 1;
    flex-shrink: 0;
    ${mixins.flexbox("row", "baseline", "flex-start")};
    gap: 20px;
    ${fonts.h5}
    color: ${({ theme }) => theme.color.text02};

    .sub-title {
      flex-shrink: 0;
      ${mixins.flexbox("row", "center", "flex-start", false)};
      gap: 4px;
      color: ${({ theme }) => theme.color.text04};
      ${fonts.body11};
      svg {
        width: 16px;
        height: 16px;
      }
      svg * {
        fill: ${({ theme }) => theme.color.icon03};
      }
      &:hover {
        color: ${({ theme }) => theme.color.text03};
        svg {
          * {
            fill: ${({ theme }) => theme.color.icon07};
          }
        }
      }
    }

    ${media.mobile} {
      ${fonts.h6}
      gap: 10px;
    }

    .left-items {
      flex: 1;
      ${mixins.flexbox("row", "center", "flex-end")};

      @media (max-width: 500px) {
        margin-top: auto;
        > div {
          > label {
            display: none;
          }
        }
      }
    }
  }

  .switch-cta-wrapper {
    ${mixins.flexbox("row", "center", "flex-start")};
    gap: 36px;

    > button {
      padding: 10px 16px;
    }
    ${media.mobile} {
      ${mixins.flexbox("column", "flex-end", "flex-start")};
      flex-direction: column-reverse;
      gap: 16px;
      width: 100%;
      justify-content: space-between;
      > button {
        padding: 10px 8px;
        width: 100%;
      }
    }
  }
`;
