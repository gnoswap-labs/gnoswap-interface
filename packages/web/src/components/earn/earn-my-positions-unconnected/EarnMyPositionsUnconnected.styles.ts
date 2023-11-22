import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";
import { media } from "@styles/media";
import mixins from "@styles/mixins";

export const UnconnectedWrapper = styled.div`
  ${mixins.flexbox("column", "center", "center")};
  ${fonts.body8}
  width: 100%;
  padding: 35px;
  ${media.tablet} {
    padding: 23px 36px;
    ${fonts.body10}
  }
  ${media.mobile} {
    padding: 15px 12px;
    ${fonts.body12}
    color: ${({ theme }) => theme.color.text05};
  }
  color: ${({ theme }) => theme.color.text10};
  background-color: ${({ theme }) => theme.color.background11};
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.color.border02};
  .unconnected-icon {
    width: 48px;
    height: 48px;
    * {
      fill: ${({ theme }) => theme.color.icon03};
    }
    ${media.mobile} {
      width: 36px;
      height: 36px;
    }
  }
  p {
    color: ${({ theme }) => theme.color.text22};
    text-align: center;
    margin: 24px 0px;
    ${media.tablet} {
      margin: 16px 0;
    }
    ${media.mobile} {
      margin: 12px 0;
    }
  }
  br {
    display: none;
    ${media.mobile} {
      display: initial;
    }
  }
  .button-connect-wallet {
    width: 200px;
    height: 46px;
    ${media.tablet} {
      height: 41px;
    }
    ${media.mobile} {
      width: 100%;
    }
  }
`;
