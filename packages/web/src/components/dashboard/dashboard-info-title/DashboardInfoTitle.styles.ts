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
    padding: 12px;
    ${mixins.flexbox("row", "center", "flex-start")};
    width: 100%;
    gap: 8px;
    ${fonts.body7};
  }
`;

export const TokenWrapper = styled.div`
  ${mixins.flexbox("row", "center", "flex-start")};
  gap: 8px;

  .amount-info {
    ${fonts.body5};
    ${media.mobile} {
      ${fonts.body9};
    }
  }
`;

export const GnosLogoWrapper = styled.div`
  ${mixins.flexbox("row", "center", "flex-start")};
  gap: 8px;

  .gnos-image-wrapper {
    ${mixins.flexbox("row", "center", "center")};
    svg {
      width: 32px;
      height: 32px;
      ${media.mobile} {
        width: 22px;
        height: 22px;
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
      ${fonts.body9};
    }
  }
`;
export const GnotLogoWrapper = styled.div`
  ${mixins.flexbox("row", "center", "flex-start")};
  gap: 8px;
  .gnot-image-wrapper {
    ${mixins.flexbox("row", "center", "center")};
    svg {
      width: 32px;
      height: 32px;
      ${media.mobile} {
        width: 22px;
        height: 22px;
      }
    }
  }
  .gnot-symbol {
    ${fonts.body5};
    ${media.tablet} {
      ${fonts.body3};
    }
    ${media.mobile} {
      ${fonts.body9};
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
  border-left: 1px solid ${({ theme }) => theme.color.border02};
  ${media.mobile} {
    height: 17px;
  }
`;
