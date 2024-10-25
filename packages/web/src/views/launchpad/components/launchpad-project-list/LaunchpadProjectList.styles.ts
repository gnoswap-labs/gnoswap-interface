import styled from "@emotion/styled";
import { media } from "@styles/media";
import mixins from "@styles/mixins";

export const ProjectListWrapper = styled.div`
  ${mixins.flexbox("column", "center", "center")};
  width: 100%;
  ${media.mobile} {
    gap: 16px;
  }
`;
