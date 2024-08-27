import styled from "@emotion/styled";

import { fonts } from "@constants/font.constant";
import { media } from "@styles/media";
import mixins from "@styles/mixins";

export const MyDelegationWrapper = styled.div`
  ${mixins.flexbox("column", "center", "flex-start")};
  width: 100%;
  gap: 24px;

  > .my-delegation-title {
    width: 100%;
    ${fonts.h5}
    color: ${({ theme }) => theme.color.text02};
    ${media.mobile} {
      ${fonts.h6};
    }
  }

  > .info-wrapper {
    ${mixins.flexbox("row", "flex-start", "flex-start")};
    width: 100%;
    border-radius: 8px;
    background-color: ${({ theme }) => theme.color.background06};
    border: 1px solid ${({ theme }) => theme.color.border02};
    @media (max-width: 968px) {
      ${mixins.flexbox("column", "flex-start", "flex-start")};
    }
    ${media.mobile} {
      flex-direction: column;
    }
  }
`;
