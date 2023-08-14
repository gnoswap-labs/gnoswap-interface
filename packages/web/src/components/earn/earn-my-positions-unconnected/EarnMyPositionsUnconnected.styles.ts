import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";
import { media } from "@styles/media";
import mixins from "@styles/mixins";

export const UnconnectedWrapper = styled.div`
  ${mixins.flexbox("column", "center", "center")};
  ${fonts.body10};
  width: 100%;
  padding: 36px;
  ${media.mobile} {
    padding: 16px 12px;
    color: ${({ theme }) => theme.color.text05};
  }
  color: ${({ theme }) => theme.color.text10};
  background-color: ${({ theme }) => theme.color.background11};
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.color.border02};
  height: 267px;
  .unconnected-icon {
    width: 48px;
    height: 48px;
    * {
      fill: ${({ theme }) => theme.color.icon03};
    }
  }
  p {
    text-align: center;
    margin: 24px 0px;
  }
`;
