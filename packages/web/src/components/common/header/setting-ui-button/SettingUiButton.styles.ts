import styled from "@emotion/styled";
import mixins from "@styles/mixins";
import { media } from "@styles/media";

export const SettingWrapper = styled.div`
  position: relative;
`;

export const SettingButton = styled.button`
  ${mixins.flexbox("row", "center", "center")};
  width: 36px;
  height: 36px;
  padding: 3px 4px 5px 4px;
  border-radius: 4px;
  transition: all 0.3s ease;
  position: relative;
  ${media.tablet} {
    width: 32px;
    height: 32px;
  }
  .setting-icon {
    width: 28px;
    height: 28px;
    ${media.tablet} {
      width: 24px;
      height: 24px;
    }
    * {
      fill: ${({ theme }) => theme.color.icon03};
    }
  }
  &:hover {
    .setting-icon * {
      fill: ${({ theme }) => theme.color.icon07};
    }
  }
`;
