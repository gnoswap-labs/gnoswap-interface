import styled from "@emotion/styled";
import mixins from "@styles/mixins";
import { fonts } from "@constants/font.constant";
import { media } from "@styles/media";

export const DashboardInfoTitleWrapper = styled.div`
  ${mixins.flexbox("row", "center", "center")};
  ${fonts.body3};
  color: ${({ theme }) => theme.color.text02};
  gap: 16px;
  ${media.mobile} {
    flex-direction: column;
    padding: 12px;
    align-items: flex-start;
    gap: 6px;
    ${fonts.body7};
  }
`;

export const TokenWrapper = styled.div`
  ${mixins.flexbox("row", "center", "flex-start")};
  gap: 8px;
`;

export const GnosLogoWrapper = styled.div`
  ${mixins.flexbox("row", "center", "flex-start")};
  gap: 8px;

  .gnos-image-wrapper {
    ${mixins.flexbox("row", "center", "center")};
    svg {
      width: 36px;
      height: 36px;
      ${media.mobile} {
        width: 25px;
        height: 25px;
      }
    }
  }
  .gnos-image {
    width: 17px;
    height: 19.5px;
    ${media.mobile} {
      width: 14.84px;
      height: 14.84px;
    }
  }
  .gnos-symbol {
    ${fonts.body5};
    ${media.tablet} {
      ${fonts.body3};
    }
    ${media.mobile} {
      ${fonts.body7};
    }
  }
`;
export const GnotLogoWrapper = styled.div`
  ${mixins.flexbox("row", "center", "flex-start")};
  gap: 8px;
  .gnot-image-wrapper {
    ${mixins.flexbox("row", "center", "center")};
    svg {
      width: 36px;
      height: 36px;
      ${media.mobile} {
        width: 25px;
        height: 25px;
      }
    }
  }
  .gnot-symbol {
    ${fonts.body5};
    ${media.tablet} {
      ${fonts.body3};
    }
    ${media.mobile} {
      ${fonts.body7};
    }
  }
  .gnot-image {
    width: 21px;
    height: 21px;
    ${media.mobile} {
      width: 14.84px;
      height: 14.84px;
    }
  }
`;

export const TitleDivider = styled.div`
  width: 1px;
  height: 24px;
  border: 1px solid ${({ theme }) => theme.color.border02};
`;
