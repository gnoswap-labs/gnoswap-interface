import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";
import { media } from "@styles/media";
import mixins from "@styles/mixins";

export const PoolInfoHeaderWrapper = styled.div`
  ${mixins.flexbox("row", "center", "flex-start")}
  width: 100%;
  gap: 8px;
  ${media.mobile} {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  .left-wrap {
    ${mixins.flexbox("row", "center", "flex-start")}
    gap: 8px;
  }

  h3 {
    ${fonts.h5};
    ${media.mobile} {
      ${fonts.h6};
    }
    color: ${({ theme }) => theme.color.text02};
  }

  .badge-wrap {
    ${mixins.flexbox("row", "center", "center")}
    gap: 2px;
    ${media.tablet} {
      gap: 8px;
    }
    ${media.tablet} {
      gap: 2px;
    }
    .badge {
      ${mixins.flexbox("row", "center", "center")}
      padding: 0px 6px;
      height: 24px;
      gap: 4px;
      border-radius: 4px;
      ${fonts.p3};
      color: ${({ theme }) => theme.color.text12};
      border: 1px solid ${({ theme }) => theme.color.border08};
      background-color: ${({ theme }) => theme.color.background08};
      );
    }
  }
`;
