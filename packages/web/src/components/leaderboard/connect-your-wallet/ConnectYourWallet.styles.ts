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

  & input {
    ${media.tablet} {
      width: 35px;
      height: 18px;

      &:after {
        ${mixins.posTopCenterLeft("3px")};
        width: 13.61px;
        height: 12.6px;
      }
      &:checked {
        &:after {
          left: 17.5px;
        }
      }
    }

    ${media.mobile} {
      width: 29px;
      height: 16px;

      &:after {
        ${mixins.posTopCenterLeft("3px")};
        width: 11.28px;
        height: 11.2px;
      }
      &:checked {
        &:after {
          left: 14.5px;
        }
      }
    }
  }
`;
