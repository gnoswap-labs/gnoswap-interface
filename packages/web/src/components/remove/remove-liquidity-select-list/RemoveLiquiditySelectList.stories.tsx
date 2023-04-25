import React, { useCallback, useEffect, useState } from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import RemoveLiquiditySelectList from "./RemoveLiquiditySelectList";
import { STAKED_OPTION } from "@constants/option.constant";

export default {
  title: "remove liquidity/RemoveLiquiditySelectList",
  component: RemoveLiquiditySelectList,
} as ComponentMeta<typeof RemoveLiquiditySelectList>;

const init = [
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
  {
    pairLogo: [
      "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x2b591e99afE9f32eAA6214f7B7629768c40Eeb39/logo.png",
      "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png",
    ],
    tokenId: "#33333",
    liquidity: "$145,541.10",
    staked: STAKED_OPTION.STAKED,
  },
  {
    pairLogo: [
      "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x2b591e99afE9f32eAA6214f7B7629768c40Eeb39/logo.png",
      "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png",
    ],
    tokenId: "#44444",
    liquidity: "$145,541.10",
    staked: STAKED_OPTION.UNSTAKING,
  },
];

const Template: ComponentStory<typeof RemoveLiquiditySelectList> = args => {
  const [checkedList, setCheckedList] = useState<string[]>([]);
  const [checkedAll, setCheckedAll] = useState(false);
  const checkableList = init.filter(
    item => item.staked === STAKED_OPTION.UNSTAKED,
  );
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
        init.forEach(
          item =>
            item.staked === STAKED_OPTION.UNSTAKED &&
            filterCheckList.push(item.tokenId),
        );
        setCheckedList(filterCheckList);
      } else {
        setCheckedList([]);
      }
    },
    [init],
  );

  useEffect(
    () => setCheckedAll(checkableList.length === checkedList.length),
    [checkedList],
  );
  return (
    <RemoveLiquiditySelectList
      {...args}
      checkedList={checkedList}
      onCheckedItem={onCheckedItem}
      onCheckedAll={onCheckedAll}
      checkedAll={checkedAll}
    />
  );
};

export const Default = Template.bind({});
Default.args = {
  list: init,
};
