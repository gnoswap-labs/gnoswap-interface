import styled from "@emotion/styled";
import { media } from "@styles/media";
import mixins from "@styles/mixins";

export const Flex = styled.div`
  ${mixins.flexbox("row", "center", "center")};
`;

export const SwitchWrapper = styled(Flex)`
  ${mixins.flexbox("row", "center", "center")};
  gap: 4px;
  padding-left: 16px;

  ${media.mobile} {
    padding-left: 4px;
  }
`;
