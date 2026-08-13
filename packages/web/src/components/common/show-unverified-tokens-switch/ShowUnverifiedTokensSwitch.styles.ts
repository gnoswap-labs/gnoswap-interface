import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";
import { media } from "@styles/media";
import mixins from "@styles/mixins";

export const UnverifiedTokensInfoWrapper = styled.div`
  display: flex;
  flex: 0 0 16px;
  width: 16px;
  height: 16px;
  cursor: default;
  margin-right: -8px;

  ${media.mobile} {
    margin-right: 0;
  }

  svg {
    width: 16px;
    height: 16px;

    path {
      fill: ${({ theme }) => theme.color.icon08};
    }
  }
`;

export const UnverifiedTokensTooltipContent = styled.div`
  ${mixins.flexbox("column", "flex-start", "flex-start")};
  gap: 16px;
  width: 320px;
  color: ${({ theme }) => theme.color.text02};
  ${fonts.body12};

  p {
    margin: 0;
  }

  a {
    ${mixins.flexbox("row", "center", "flex-start")};
    gap: 8px;
    color: ${({ theme }) => theme.color.text04};
    text-decoration: none;

    &:hover {
      color: ${({ theme }) => theme.color.text01};
    }

    svg {
      flex: 0 0 16px;

      path {
        fill: currentColor;
      }
    }
  }

  ${media.mobile} {
    width: min(320px, calc(100vw - 32px));
  }
`;
