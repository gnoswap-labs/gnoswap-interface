import styled from "@emotion/styled";
import mixins from "@styles/mixins";
import { media } from "@styles/media";
import { fonts } from "@constants/font.constant";

export const DetailClickHereWrapper = styled.div`
  ${mixins.flexbox("row", "center", "center")};
  gap: 4px;
  font-size: 14px;
  font-weight: 500;
  .text {
    color: ${({ theme }) => theme.color.text04};
  }
  button {
    ${mixins.flexbox("row", "center", "center")};
    color: ${({ theme }) => theme.color.text08};
    svg {
      width: 16px;
      height: 16px;
    }
  }
`;

export const LinkButton = styled.div`
  ${mixins.flexbox("row", "center", "center")};
  width: 100%;
  ${fonts.body11};
  gap: 4px;
  color: ${({ theme }) => theme.color.text04};
  ${media.mobile} {
    ${fonts.p3};
  }
  a {
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
    flex-wrap: wrap;
    padding: 0 20px;
  }
`;
