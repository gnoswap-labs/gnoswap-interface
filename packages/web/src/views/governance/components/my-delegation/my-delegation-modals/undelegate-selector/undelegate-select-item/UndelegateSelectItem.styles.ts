import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";
import { media } from "@styles/media";

interface Props {
  visibleAmount: boolean;
  onSelectedArea?: boolean;
}

export const UndelegateSelectItemWrapper = styled.div<Props>`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: auto;
  align-items: center;
  padding: ${({ visibleAmount }) => {
    return visibleAmount ? "12px 0" : "16px 0";
  }};
  cursor: pointer;

  .left-content-wrapper {
    display: flex;
    flex-direction: row;
    width: 100%;
    height: auto;
    gap: 5px;
    align-items: center;

    .delegatee-name {
      color: ${({ theme }) => theme.color.text02};
      ${fonts.body9}
      ${media.mobile} {
        ${fonts.body11}
      }
    }
  }

  .right-content-wrapper {
    display: flex;
    flex-direction: column;
    width: fit-content;
    height: auto;
    align-items: center;

    .delegated-amount {
      height: 14px;
      color: ${({ theme }) => theme.color.text02};
      ${fonts.body9}
      line-height: 100%;
      ${media.mobile} {
        ${fonts.body11}
        line-height: 100%;
      }
    }
  }

  &:hover {
    background-color: ${({ onSelectedArea, theme }) => {
      return onSelectedArea ? "transparent" : theme.color.hover02;
    }};
  }
`;

export const UndelegateSelectItemDefaultWrapper = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  color: ${({ theme }) => theme.color.text02};
  align-items: center;
`;
