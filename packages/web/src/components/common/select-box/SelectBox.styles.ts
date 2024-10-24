import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";
import { media } from "@styles/media";
import { Z_INDEX } from "@styles/zIndex";

export const SelectBoxWrapper = styled.div`
  position: relative;
  display: flex;
  width: 100%;
  height: 48px;
  padding: 0px 16px;
  gap: 8px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.color.border02};
  background: ${({ theme }) => theme.color.background20};
  z-index: 3;
  &:hover {
    background: ${({ theme }) => theme.color.background11};
  }
  .selected-wrapper {
    position: relative;
    display: flex;
    width: 100%;
    height: 100%;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
  }

  .icon-arrow {
    width: 16px;
    height: 16px;
    * {
      fill: ${({ theme }) => theme.color.icon01};
    }
  }

  .current {
    ${fonts.body9}
    color: ${({ theme }) => theme.color.text02};
  }
  ${media.mobile} {
    padding: 0 8px;
    z-index: auto;
  }
`;

export const SelectBoxModalWrapper = styled.div`
  position: absolute;
  top: 53px;
  left: 0;
  background-color: ${({ theme }) => theme.color.background06};
  border: 1px solid ${({ theme }) => theme.color.border02};
  border-radius: 8px;
  box-shadow: 10px 14px 60px 0px rgba(0, 0, 0, 0.4);
  z-index: 4;
  .item-wrapper {
    white-space: nowrap;
  }

  display: none;
  ${media.mobile} {
    transition: max-height 1s ease;
    position: fixed;
    top: auto;
    bottom: 0;
    width: 100vw;
    min-width: 360px;
    left: 0;
    z-index: ${Z_INDEX.fixed};
    max-height: 0;
    display: block;
  }
  &.open {
    display: block;
    ${media.mobile} {
      max-height: 273px;
    }
  }
`;
