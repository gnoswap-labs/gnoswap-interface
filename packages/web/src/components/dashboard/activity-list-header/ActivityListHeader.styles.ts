import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";
import mixins from "@styles/mixins";
import { ContainerWidth, media } from "@styles/media";

export const ActivityListHeaderwrapper = styled.div`
  ${mixins.flexbox("row", "center", "flex-start")};
  width: 100%;
  gap: 36px;

  ${media.mobile} {
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    gap: 24px;
  }
  h2 {
    ${fonts.h5};
    ${media.mobile} {
      ${fonts.h6};
    }
    color: ${({ theme }) => theme.color.text02};
  }
  .overflow-tab {
    > div {
      padding: 1px;
    }
    ${media.mobile} {
      max-width: ${ContainerWidth.MOBILE_CONTAINER};
      width: 100%;
      overflow-x: auto;
      button {
        padding: 4px 24px;
      }
    }
  }
`;
