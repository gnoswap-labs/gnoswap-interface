import UnstakeLiquidity from "@components/unstake/unstake-liquidity/UnstakeLiquidity";
import { STAKED_OPTION } from "@constants/option.constant";
import React, { useCallback, useEffect, useState } from "react";

export const initData = [
  {
    pairLogo: [
      "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x2b591e99afE9f32eAA6214f7B7629768c40Eeb39/logo.png",
      "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png",
    ],
    tokenId: "#11111",
    liquidity: "$145,541.10",
    staked: STAKED_OPTION.UNSTAKED,
  },
  {
    pairLogo: [
      "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x2b591e99afE9f32eAA6214f7B7629768c40Eeb39/logo.png",
      "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png",
    ],
    tokenId: "#22222",
    liquidity: "$145,541.10",
    staked: STAKED_OPTION.UNSTAKED,
  },
];

const UnstakeLiquidityContainer: React.FC = () => {
  const [checkedList, setCheckedList] = useState<string[]>([]);
  const [checkedAll, setCheckedAll] = useState(false);

  const onCheckedItem = useCallback(
    (isChecked: boolean, tokenId: string) => {
      if (isChecked) {
        return setCheckedList((prev: string[]) => [...prev, tokenId]);
      }
      if (!isChecked && checkedList.includes(tokenId)) {
        return setCheckedList(checkedList.filter(el => el !== tokenId));
      }
    },
    [checkedList],
  );

  const onCheckedAll = useCallback(
    (checked: boolean) => {
      setCheckedAll((prev: boolean) => !prev);
      if (checked) {
        const filterCheckList: string[] = [];
        initData.forEach(item => filterCheckList.push(item.tokenId));
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

  return (
    <UnstakeLiquidity
      data={initData}
      checkedList={checkedList}
      onCheckedItem={onCheckedItem}
      onCheckedAll={onCheckedAll}
      checkedAll={checkedAll}
    />
  );
};

export default UnstakeLiquidityContainer;
