import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";
import { media } from "@styles/media";

interface Props {
  visibleLiquidity: boolean;
}

export const PoolIncentivizeSelectPoolItemWrapper = styled.div<Props>`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: auto;
  align-items: center;
  padding: ${({ visibleLiquidity}) => {
    return visibleLiquidity ? "12px 0" : "16px 0";
  }};
  cursor: pointer;

  .main-content-wrapper {
    display: flex;
    flex-direction: row;
    width: 100%;
    height: auto;
    gap: 5px;
    align-items: center;

    .token-pair-name {
      color: ${({ theme }) => theme.color.text03};
      ${fonts.body10}
      ${media.mobile} {
        ${fonts.body12}
      }
    }
  }

  .sub-content-wrapper {
    display: flex;
    flex-direction: column;
    width: fit-content;
    height: auto;
    align-items: center;

    .liquidity {
      height: 14px;
      color: ${({ theme }) => theme.color.text03};
      ${fonts.body9}
      ${media.mobile} {
        ${fonts.body11}
      }
    }
  }

  &:hover {
    background-color:  ${({ visibleLiquidity, theme}) => {
      return visibleLiquidity ? theme.color.hover02 : "transparent";
    }};
  }
`;

export const PoolIncentivizeSelectPoolItemDefaultWrapper = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  color: ${({ theme }) => theme.color.text02};
  align-items: center;
`;
