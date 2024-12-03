import styled from "@emotion/styled";
import { media } from "@styles/media";
import mixins from "@styles/mixins";

export const ActiveProjectCardHeader = styled.div`
  ${mixins.flexbox("row", "center", "space-between")};
  width: 100%;
  .header-title-wrapper {
    ${mixins.flexbox("column", "flex-start", "center")};
    flex: 1;
    min-width: 0;
    gap: 8px;
    .title {
      ${mixins.flexbox("row", "center", "space-between")};
      gap: 8px;
      color: ${({ theme }) => theme.color.text02};
      font-size: 28px;
      font-weight: 500;
      ${media.tablet} {
        ${mixins.flexbox("column", "flex-start", "center")};
        font-size: 24px;
        font-weight: 500;
        max-width: 100%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      ${media.mobile} {
        font-size: 22px;
      }
    }
    .project-name {
      max-width: calc(100% - 100px);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      ${media.tablet} {
        max-width: 100%;
      }
    }
    .text {
      color: ${({ theme }) => theme.color.text05};
      font-size: 14px;
      font-weight: 400;
      max-width: calc(100% - 32px);
      width: 100%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      ${media.tablet} {
        font-size: 14px;
        font-weight: 400;
        /* max-width: 406px; */
      }
    }
  }
  .image-wrapper {
    align-self: flex-start;
    width: 60px;
    height: 60px;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
`;
