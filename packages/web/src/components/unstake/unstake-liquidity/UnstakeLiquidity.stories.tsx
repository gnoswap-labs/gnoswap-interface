import React, { useCallback, useEffect, useState } from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import UnstakeLiquidity from "./UnstakeLiquidity";
import { STAKED_OPTION } from "@constants/option.constant";

export default {
  title: "unstake/UnstakeLiquidity",
  component: UnstakeLiquidity,
} as ComponentMeta<typeof UnstakeLiquidity>;

const init = [
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

const Template: ComponentStory<typeof UnstakeLiquidity> = args => {
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
        init.forEach(item => filterCheckList.push(item.path));
        setCheckedList(filterCheckList);
      } else {
        setCheckedList([]);
      }
    },
    [init],
  );

  useEffect(
    () => setCheckedAll(init.length === checkedList.length),
    [checkedList],
  );
  return (
    <UnstakeLiquidity
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
  data: init,
};
