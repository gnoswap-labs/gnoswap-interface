import UnstakeLiquidity from "@components/unstake/unstake-liquidity/UnstakeLiquidity";
import { STAKED_OPTION } from "@constants/option.constant";
import { useUnstakePositionModal } from "@hooks/earn/use-unstake-position-modal";
import React, { useCallback, useEffect, useState } from "react";

export const initData = [
  {
    pairLogo: [
      "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x2b591e99afE9f32eAA6214f7B7629768c40Eeb39/logo.png",
      "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png",
    ],
    path: "ID 11111",
    liquidity: "$145,541.10",
    staked: STAKED_OPTION.UNSTAKED,
  },
  {
    pairLogo: [
      "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x2b591e99afE9f32eAA6214f7B7629768c40Eeb39/logo.png",
      "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png",
    ],
    path: "ID 22222",
    liquidity: "$145,541.10",
    staked: STAKED_OPTION.UNSTAKED,
  },
];

const UnstakeLiquidityContainer: React.FC = () => {
  const [checkedList, setCheckedList] = useState<string[]>([]);
  const [checkedAll, setCheckedAll] = useState(false);

  const { openModal } = useUnstakePositionModal();

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
        initData.forEach(item => filterCheckList.push(item.path));
        setCheckedList(filterCheckList);
      } else {
        setCheckedList([]);
      }
    },
    [initData],
  );

  useEffect(
    () => setCheckedAll(initData.length === checkedList.length),
    [checkedList],
  );

  const handleConfirmUnstake = useCallback(() => {
    openModal();
  }, []);

  return (
    <UnstakeLiquidity
      data={initData}
      checkedList={checkedList}
      onCheckedItem={onCheckedItem}
      onCheckedAll={onCheckedAll}
      checkedAll={checkedAll}
      handleConfirmUnstake={handleConfirmUnstake}
    />
  );
};

export default UnstakeLiquidityContainer;
