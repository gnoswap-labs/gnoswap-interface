import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";
import { media } from "@styles/media";
import mixins from "@styles/mixins";

export const ProposalHeaderWrapper = styled.div`
  ${mixins.flexbox("row", "center", "space-between")};
  width: 100%;
  margin-top: 16px;
  ${media.mobile} {
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    gap: 8px;
  }
  .title-header {
    position: relative;
    ${mixins.flexbox("row", "center", "flex-start")};
    .sub-title {
      ${mixins.flexbox("row", "center", "center", false)};
      gap: 4px;
      ${fonts.body11};
      position: absolute;
      width: 100%;
      left: 130px;
      bottom: 4px;
      svg {
        width: 16px;
        height: 16px;
      }
    }
    ${media.tablet} {
      .sub-title {
        left: 122px;
      }
    }
    ${media.mobile} {
      justify-content: space-between;
      .sub-title {
        left: 96px;
        width: max-content;
        bottom: 1px;
      }
    }
  }
  h2 {
    ${fonts.h5};
    color: ${({ theme }) => theme.color.text02};
    ${media.mobile} {
      ${fonts.h6};
    }
  }
  .switch-button {
    ${mixins.flexbox("row", "center", "flex-start")};
    gap: 36px;
    button {
      padding: 10px 16px;
    }
    ${media.mobile} {
      ${mixins.flexbox("column", "flex-start", "flex-start")};
      flex-direction: column-reverse;
      gap: 12px;
      width: 100%;
      justify-content: space-between;
      button {
        padding: 10px 8px;
        width: 100%;
      }
    }
  }
`;
