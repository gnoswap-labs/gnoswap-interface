import mixins from "@styles/mixins";
import styled from "@emotion/styled";
import { fonts } from "@constants/font.constant";
import { ContainerWidth, media } from "@styles/media";

export const TitleWrapper = styled.div`
  ${mixins.flexbox("column", "flex-start", "flex-start")};
  max-width: ${ContainerWidth.WEB_CONTAINER};
  width: 100%;
  padding: 0px 40px 0px 40px;
  gap: 16px;

  ${media.tablet} {
    gap: 16px;
  }
  ${media.mobile} {
    padding: 0px 0px 0px 0px;
    gap: 10px;
  }
`;

export const Title = styled.h3`
  ${mixins.flexbox("column", "flex-end", "center")};
  ${fonts.h3};
  color: ${({ theme }) => theme.color.text02};
  ${media.mobile} {
    ${fonts.h5};
  }
`;

export const Section = styled.section`
  ${mixins.flexbox("column", "center", "flex-start")};
  max-width: ${ContainerWidth.WEB_SECTION_CONTAINER};
  width: 100%;
  padding: 100px 0px 36px 0px;

  gap: 36px;
  // ${media.tablet} {
  //   max-width: ${ContainerWidth.TABLET_CONTAINER};
  //   padding: 60px 0px 60px 0px;
  //   gap: 24px;
  // }
  ${media.mobile} {
    max-width: ${ContainerWidth.MOBILE_CONTAINER};
    width: 100%;
    padding: 24px 16px 24px 16px;
    gap: 24px;
  }
`;

export const LayoutWrapper = styled.div`
  ${mixins.flexbox("column", "center", "flex-start")};
  width: 100%;
  background-color: ${({ theme }) => theme.color.background01};
`;

export const ListSection = styled.div`
  ${mixins.flexbox("column", "center", "flex-start")};
  max-width: ${ContainerWidth.WEB_SECTION_CONTAINER};
  width: 100%;

  padding-bottom: 48px;

  // ${media.tablet} {
  //   max-width: ${ContainerWidth.TABLET_CONTAINER};
  //   padding-left: 16px;
  //   padding-right: 16px;
  // }

  ${media.mobile} {
    max-width: ${ContainerWidth.MOBILE_CONTAINER};
    width: 100%;
    padding-left: 16px;
    padding-right: 16px;
  }
  position: relative;
`;

export const ListContainer = styled.div`
  ${mixins.flexbox("column", "center", "center")};
  max-width: ${ContainerWidth.WEB_CONTAINER};
  width: 100%;
  padding: 0px 40px;
  gap: 24px;
  ${media.tablet} {
    max-width: ${ContainerWidth.TABLET_CONTAINER};
  }
  ${media.mobile} {
    max-width: ${ContainerWidth.MOBILE_CONTAINER};
    padding: 0px;
    gap: 24px;
  }
`;
