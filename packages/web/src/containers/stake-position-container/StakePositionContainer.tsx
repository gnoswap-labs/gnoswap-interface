import StakePosition from "@components/stake/stake-position/StakePosition";
import { STAKED_OPTION } from "@constants/option.constant";
import { useWindowSize } from "@hooks/common/use-window-size";
import { useSubmitPositionModal } from "@hooks/earn/use-submit-position-modal";
import React, { useCallback, useState, useEffect } from "react";

export const unstakingPeriodInit = [
  {
    days: "7 days",
    apr: "88%",
  },
  {
    days: "14 days",
    apr: "130%",
  },
  {
    days: "21 days",
    apr: "202%",
  },
];
export const selectLiquidityInit = [
  {
    pairLogo: [
      "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x2b591e99afE9f32eAA6214f7B7629768c40Eeb39/logo.png",
      "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png",
    ],
    path: "GNS/BTC",
    liquidity: "1455433112.10",
    staked: STAKED_OPTION.UNSTAKED,
  },
  {
    pairLogo: [
      "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x2b591e99afE9f32eAA6214f7B7629768c40Eeb39/logo.png",
      "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png",
    ],
    path: "GNS/ETH",
    liquidity: "112.10",
    staked: STAKED_OPTION.UNSTAKED,
  },
];

export const data = {
  period: unstakingPeriodInit,
  liquidity: selectLiquidityInit,
};

const StakePositionContainer: React.FC = () => {
  const { width } = useWindowSize();
  const [checkedList, setCheckedList] = useState<string[]>([]);
  const [checkedAll, setCheckedAll] = useState(false);
  const { openModal } = useSubmitPositionModal();
  const onCheckedItem = useCallback(
    (isChecked: boolean, path: string) => {
      if (isChecked) {
        return setCheckedList((prev: string[]) => [...prev, path]);
      }
      if (!isChecked && checkedList.includes(path)) {
        if (checkedAll) {
          setCheckedAll(false);
        }
        return setCheckedList(checkedList.filter(el => el !== path));
      }
    },
    [checkedList],
  );

  useEffect(() => {
    if (checkedList.length === data.liquidity.length) {
      setCheckedAll(true);
    } else if (checkedList.length === 0) {
      setCheckedAll(false);
    }
  }, [checkedList]);

  const onCheckedAll = useCallback(
    (checked: boolean) => {
      setCheckedAll((prev: boolean) => !prev);
      if (checked) {
        const filterCheckList: string[] = [];
        selectLiquidityInit.forEach(item => filterCheckList.push(item.path));
        setCheckedList(filterCheckList);
      } else {
        setCheckedList([]);
      }
    },
    [selectLiquidityInit],
  );

  const submitPosition = useCallback(() => {
    openModal();
  }, [openModal]);

  return (
    <StakePosition
      data={data}
      checkedList={checkedList}
      onCheckedItem={onCheckedItem}
      onCheckedAll={onCheckedAll}
      checkedAll={checkedAll}
      submitPosition={submitPosition}
      width={width}
    />
  );
};

export default StakePositionContainer;
