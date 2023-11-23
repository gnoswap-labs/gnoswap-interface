import StakeLiquidity from "@components/stake/stake-liquidity/StakeLiquidity";
import { STAKED_OPTION } from "@constants/option.constant";
import React, { useCallback, useState } from "react";

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
    path: "#11111",
    liquidity: "$145,541.10",
    staked: STAKED_OPTION.UNSTAKED,
  },
  {
    pairLogo: [
      "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x2b591e99afE9f32eAA6214f7B7629768c40Eeb39/logo.png",
      "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png",
    ],
    path: "#22222",
    liquidity: "$145,541.10",
    staked: STAKED_OPTION.UNSTAKED,
  },
];

export const data = {
  period: unstakingPeriodInit,
  liquidity: selectLiquidityInit,
};

const StakeLiquidityContainer: React.FC = () => {
  const [activePeriod, setActivePeriod] = useState(-1);

  const onClickPeriod = (idx: number) => {
    setActivePeriod(idx);
  };

  const [checkedList, setCheckedList] = useState<string[]>([]);
  const [checkedAll, setCheckedAll] = useState(false);

  const onCheckedItem = useCallback(
    (isChecked: boolean, path: string) => {
      if (isChecked) {
        return setCheckedList((prev: string[]) => [...prev, path]);
      }
      if (!isChecked && checkedList.includes(path)) {
        return setCheckedList(checkedList.filter(el => el !== path));
      }
    },
    [checkedList],
  );

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

  return (
    <StakeLiquidity
      data={data}
      activePeriod={activePeriod}
      checkedList={checkedList}
      onClickPeriod={onClickPeriod}
      onCheckedItem={onCheckedItem}
      onCheckedAll={onCheckedAll}
      checkedAll={checkedAll}
      width={0}
    />
  );
};

export default StakeLiquidityContainer;
