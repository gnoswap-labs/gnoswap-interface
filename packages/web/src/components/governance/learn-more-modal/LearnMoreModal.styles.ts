import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";
import { media } from "@styles/media";
import mixins from "@styles/mixins";
import { Z_INDEX } from "@styles/zIndex";
export const LearnMoreModalBackground = styled.div`
  position: fixed;
  overflow: scroll;
  top: 0px;
  bottom: 0px;
  left: 0px;
  right: 0px;
  width: 100%;
  height: 100lvh;
  background: rgba(10, 14, 23, 0.7);
  z-index: ${Z_INDEX.modalOverlay};
`;

export const LearnMoreModalWrapper = styled.div`
  ${mixins.flexbox("column", "flex-start", "flex-start")};
  position: absolute;
  overflow: hidden;
  width: 690px;
  border-radius: 8px;
  padding: 24px;
  gap: 24px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 10px 14px 60px 0px rgba(0, 0, 0, 0.4);
  border: 1px solid ${({ theme }) => theme.color.border02};
  background-color: ${({ theme }) => theme.color.background06};
  ${media.mobile} {
    width: 320px;
    padding: 24px;
    transform: translate(-50%, -50%);
  }
  .modal-body {
    ${mixins.flexbox("column", "flex-start", "flex-start")};
    width: 100%;
    padding: 0px 24px;
    gap: 16px;
    ${media.mobile} {
      padding: 0px;
    }
  }
  .learn-more-btn {
    height: 57px;
    background-color: ${({ theme }) => theme.color.background05};
    &:hover {
      background-color: ${({ theme }) => theme.color.backgroundOpacity};
    }
    ${media.mobile} {
      width: 272px;
      height: 41px;
    }
  }
`;

export const Progress = styled.div`
  ${mixins.flexbox("row", "flex-start", "flex-start")};
  gap: 4px;
  width: 100%;
  div {
    flex: 1;
    height: 3px;
    border-radius: 4px;
    background-color: ${({ theme }) => theme.color.border02};
  }
  .active-progress {
    background-color: ${({ theme }) => theme.color.border03};
  }
`;

export const Slider = styled.div`
  ${mixins.flexbox("column", "flex-start", "flex-start")};
  gap: 24px;
  width: 100%;
`;

export const Title = styled.div`
  ${mixins.flexbox("column", "center", "center")};
  padding: 0px 77px;
  ${media.mobile} {
    padding: 0px;
  }
  width: 100%;
  gap: 8px;
  h3 {
    ${fonts.body3}
    color: ${({ theme }) => theme.color.text02};
  }
  div {
    color: ${({ theme }) => theme.color.text10};
    ${fonts.body12}
    text-align: center;
  }
  ${media.mobile} {
    h3 {
      ${fonts.body7}
    }
    div {
      ${fonts.p2}
      br {
        display: none;
      }
    }
  }
`;

export const BoxImage = styled.div`
  margin: 0px 77px;
  position: relative;
  img {
    -webkit-user-drag: none;
    pointer-events: none;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    width: 100%;
    aspect-ratio: 3/2;
    object-fit: cover;
    border-radius: 8px;
    display: block;
    border: 1px solid ${({ theme }) => theme.color.border01};
  }
  .slide-icon {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    * {
      fill: ${({ theme }) => theme.color.border02};
    }
  }
  .left-icon {
    left: -77px;
  }
  .right-icon {
    right: -77px;
  }
  .active-icon {
    cursor: pointer;
    * {
      fill: ${({ theme }) => theme.color.icon03};
    }
  }
  ${media.mobile} {
    margin: 0px 32px;
    .left-icon {
      left: -40px;
    }
    .right-icon {
      right: -40px;
    }
  }
`;
