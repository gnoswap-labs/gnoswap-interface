import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";
import mixins from "@styles/mixins";
import { media } from "@styles/media";

export const ActivityListHeaderwrapper = styled.div`
  ${mixins.flexbox("row", "center", "flex-start")};
  width: 100%;
  gap: 36px;
  ${media.mobile} {
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    gap: 8px;
  }
  h2 {
    ${fonts.h5};
    ${media.mobile} {
      ${fonts.h6};
    }
    color: ${({ theme }) => theme.color.text02};
  }
  .overflow-tab {
    ${media.mobile} {
      max-width: 324px;
      width: 100%;
      overflow-x: auto;
    }
  }
`;
