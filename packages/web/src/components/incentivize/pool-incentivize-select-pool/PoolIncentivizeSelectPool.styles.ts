import styled from "@emotion/styled";
import { PoolIncentivizeBoxStyle } from "../pool-incentivize/PoolIncentivize.styles";
import { fonts } from "@constants/font.constant";
import mixins from "@styles/mixins";
import { media } from "@styles/media";

export const PoolIncentivizeSelectPoolWrapper = styled.div`
  ${({ theme }) => PoolIncentivizeBoxStyle(theme)};
  position: relative;
  display: flex;
  width: 100%;
  flex-direction: column;
  justify-content: center;
  gap: 16px;

  h5 {
    color: ${({ theme }) => theme.color.text10};
    ${fonts.body12}
  }

  .pool-select-wrapper {
    position: relative;
    display: flex;
    width: 100%;
    height: 48px;
    padding: 0 16px;
    background-color: #fff;
    border-radius: 8px;
    border: 1px solid ${({ theme }) => theme.color.border02};
    background: ${({ theme }) => theme.color.background20};
    &:hover {
      background: ${({ theme }) => theme.color.background11};
      cursor: pointer;
    }
    color: var(--text-02-dark-gray-100-text-2, #e0e8f4);
    ${fonts.body9}
    justify-content: space-between;
    align-items: center;

    .icon-wrapper {
      width: 16px;
      height: 16px;
      * {
        fill: ${({ theme }) => theme.color.icon01};
      }
    }
  }
`;

export const PoolIncentivizeSelectPoolBox = styled.div`
  position: absolute;
  top: 53px;
  left: 0;
  width: 100%;
  background-color: ${({ theme }) => theme.color.background06};
  border: 1px solid ${({ theme }) => theme.color.border02};
  border-radius: 8px;
  box-shadow: 10px 14px 60px 0px rgba(0, 0, 0, 0.4);
  z-index: 4;

  .search-wrapper {
    padding: 16px 24px;
  }

  .pool-list-wrapper {
    padding-bottom: 8px;

    .pool-list-headrer {
      ${mixins.flexbox("flex", "center", "space-between")}
      padding: 0 24px 8px 24px;
      color: ${({ theme }) => theme.color.text04};
      ${fonts.p4}
    }

    .pool-list-content {
      max-height: 280px;
      overflow-y: auto;

      & > div {
        padding: 16px 24px;
      }
    }
  }
  ${media.mobile} {
    top: 0;
    left: calc((100% - 100vw) / 2);
    width: 100vw;

  }
`;
