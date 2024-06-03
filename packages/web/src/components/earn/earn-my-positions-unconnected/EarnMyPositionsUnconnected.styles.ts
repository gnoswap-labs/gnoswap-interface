import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";
import { media } from "@styles/media";
import mixins from "@styles/mixins";

export const UnconnectedWrapper = styled.div`
  ${mixins.flexbox("column", "center", "center")};
  ${fonts.body8}
  line-height: 23px;
  width: 100%;
  padding: 19px 19px 22px 19px;
  ${media.tablet} {
    padding: 19px 19px 24px 19px;
    ${fonts.body10}
  }
  ${media.mobile} {
    padding: 29.5px 11px;
    ${fonts.body12}
    color: ${({ theme }) => theme.color.text05};
  }
  color: ${({ theme }) => theme.color.text10};
  background-color: ${({ theme }) => theme.color.backgroundOpacity9};
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.color.border02};
  .unconnected-icon {
    width: 50px;
    height: 50px;
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
    margin: 18px 0px;

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
    ${media.mobile} {
      height: 41px;
      width: 100%;
    }
  }
`;
