import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";
import { media } from "@styles/media";
import mixins from "@styles/mixins";
export const BannerContent = styled.div`
  ${mixins.flexbox("column", "center", "flex-start")};
  padding: 40px 0;
  width: 100%;
  border-radius: 16px;
  background: rgb(1, 88, 168);
  background: linear-gradient(
    132deg,
    rgba(1, 88, 168, 1) 0%,
    rgba(2, 28, 146, 1) 10%,
    rgba(2, 8, 35, 1) 39%,
    rgba(2, 16, 45, 1) 54%,
    rgba(2, 32, 61, 1) 71%,
    rgba(2, 135, 199, 1) 100%,
    rgba(2, 135, 199, 1) 100%
  );
  > h4 {
    ${fonts.h4}
    color: ${({ theme }) => theme.color.text20};
    margin-bottom: 12px;
    ${media.tablet} {
      font-size: 28px;
      line-height: 34px;
      margin-bottom: 12px;
    }
    ${media.mobile} {
      font-size: 16px;
      line-height: 19px;
      margin-bottom: 8px;
    }
  }
  > p {
    color: ${({ theme }) => theme.color.text05};
    margin-bottom: 26px;
    font-size: 14px;
    font-weight: 400px;
    line-height: 17px;
    ${media.tablet} {
      font-size: 12px;
      line-height: 15px;
      svg {
        width: 18px;
        height: 18px;
      }
    }
    ${media.mobile} {
      font-size: 8px;
      line-height: 10px;
      margin-bottom: 16px;
    }
  }
  .banner-button {
    font-weight: 500;
    line-height: 17px;
    svg {
      width: 20px;
      height: 20px;
    }
    svg * {
      fill: ${({ theme }) => theme.color.icon19} !important;
    }
    &:hover {
      span {
        color: ${({ theme }) => theme.color.text28};
      }
      svg * {
        fill: ${({ theme }) => theme.color.icon20} !important;
      }
      background-color: ${({ theme }) => theme.color.background04Hover};
    }
    ${media.tablet} {
      > span {
        font-size: 12px;
        line-height: 15px;
      }
      svg {
        width: 18px;
        height: 18px;
      }
    }
    ${media.mobile} {
        padding: 8px;
        > span {
        font-size: 8px;
        font-weight: 500;
        line-height: 9.5px;
      }
      svg {
        width: 12px;
        height: 12px;
      }
    }
  }
  ${media.mobile} {
    padding: 20px 10px;
  }
`;
