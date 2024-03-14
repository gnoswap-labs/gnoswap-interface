import styled from "@emotion/styled";
import { media } from "@styles/media";
import mixins from "@styles/mixins";

export const Wrapper = styled.div`
  ${mixins.flexbox("column", "center", "center")};
  width: 100%;

  gap: 20px;
  ${media.mobile} {
    gap: 10px;
  }
`;
