import styled from "@emotion/styled";

import { fonts } from "@constants/font.constant";
import { media } from "@styles/media";
import mixins from "@styles/mixins";

export const GovernanceSummaryWrapper = styled.div`
  ${mixins.flexbox("column", "center", "flex-start")};
  width: 100%;
  gap: 22px;

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
  }

  > .link-button {
    ${mixins.flexbox("row", "center", "center")};
    width: 100%;
    ${fonts.body11};
    gap: 4px;
    color: ${({ theme }) => theme.color.text22};
    ${media.mobile} {
      ${fonts.p3};
      flex-direction: column;
    }
    a {
      display: block;
      ${mixins.flexbox("row", "center", "center")};
      color: ${({ theme }) => theme.color.text07};
      &:hover {
        color: ${({ theme }) => theme.color.text08};
        svg {
          * {
            fill: ${({ theme }) => theme.color.icon14};
          }
        }
      }
    }
    svg {
      width: 16px;
      height: 16px;
      * {
        fill: ${({ theme }) => theme.color.text07};
      }
    }
    ${media.mobile} {
      margin-bottom: 8px;
      flex-wrap: wrap;
    }
  }
`;
