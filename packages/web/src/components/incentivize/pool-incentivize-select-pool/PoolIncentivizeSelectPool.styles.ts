import styled from "@emotion/styled";
import { PoolIncentivizeBoxStyle } from "../pool-incentivize/PoolIncentivize.styles";
import { fonts } from "@constants/font.constant";

export const PoolIncentivizeSelectPoolWrapper = styled.div`
  ${({ theme }) => PoolIncentivizeBoxStyle(theme)};
  position: relative;
  display: flex;
  width: 100%;
  flex-direction: column;
  justify-content: center;
  gap: 16px;

  h5 {
    color: ${({ theme }) => theme.color.text05};
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
    border: 1px solid var(--global-gray-gray-500, #1c2230);
    background: var(--global-opacity-black-opacity-07, rgba(10, 14, 23, 0.7));
    color: var(--text-02-dark-gray-100-text-2, #e0e8f4);
    ${fonts.body9}
    justify-content: space-between;
    align-items: center;

    .icon-wrapper {
      width: 16px;
      height: 16px;
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
`;
