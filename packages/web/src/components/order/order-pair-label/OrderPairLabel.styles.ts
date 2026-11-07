import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";
import { media } from "@styles/media";
import mixins from "@styles/mixins";

export const OrderPairLabelWrapper = styled.div`
  ${mixins.flexbox("row", "center", "flex-start")};
  min-width: 0;
  gap: 6px;
  ${fonts.body9};
  color: ${({ theme }) => theme.color.text02};
  ${media.mobile} {
    ${fonts.body11};
  }

  .pair-symbols {
    ${mixins.flexbox("row", "center", "flex-start")};
    gap: 4px;
    white-space: nowrap;
  }

  .pair-arrow {
    width: 14px;
    height: 14px;
  }
  .pair-arrow * {
    fill: ${({ theme }) => theme.color.icon03};
  }

  .pair-link {
    ${mixins.flexbox("row", "center", "center")};
    .path-link-icon * {
      fill: ${({ theme }) => theme.color.icon03};
    }
    &:hover .path-link-icon * {
      fill: ${({ theme }) => theme.color.icon07};
    }
  }
`;
