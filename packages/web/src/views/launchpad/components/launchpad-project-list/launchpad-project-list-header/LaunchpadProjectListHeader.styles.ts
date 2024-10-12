import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";
import mixins from "@styles/mixins";
import { media } from "@styles/media";

export const ProjectListHeaderWrapper = styled.div`
  ${mixins.flexbox("row", "center", "space-between")};
  width: 100%;
  align-self: stretch;
  ${media.mobile} {
    flex-direction: column;
    gap: 24px;
    align-items: flex-start;
    .select-tab-wrapper {
      button {
        padding: 4px 24px;
      }
    }
  }
  .title-container {
    width: 100%;
    ${mixins.flexbox("row", "center", "space-between")};
    gap: 36px;
    ${media.mobile} {
      width: 100%;
      height: 24px;
    }
  }
  h2 {
    ${fonts.h5};
    ${media.mobile} {
      ${fonts.h6}
    }
    color: ${({ theme }) => theme.color.text02};
  }
`;
