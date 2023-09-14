import React, { useCallback, useMemo, useState } from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import RemoveLiquiditySelectList from "./RemoveLiquiditySelectList";
import { LiquidityInfoModel } from "@models/liquidity/liquidity-info-model";
import BigNumber from "bignumber.js";

export default {
  title: "remove liquidity/RemoveLiquiditySelectList",
  component: RemoveLiquiditySelectList,
} as ComponentMeta<typeof RemoveLiquiditySelectList>;

const tokenPair = {
  token0: {
    tokenId: "1",
    name: "Gnoland",
    symbol: "GNOT",
    tokenLogo: "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x2b591e99afE9f32eAA6214f7B7629768c40Eeb39/logo.png",
    amount: {
      value: BigNumber("1140.058845"),
      denom: "GNOT",
    }
  },
  token1: {
    tokenId: "2",
    name: "Gnoswap",
    symbol: "GNOS",
    tokenLogo: "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png",
    amount: {
      value: BigNumber("942.55884"),
      denom: "GNOS",
    }
  },
};

const liquidities: LiquidityInfoModel[] = [
  {
    liquidityId: "#14450",
    tokenPair: tokenPair,
    fee: tokenPair,
    amount: "145541.10",
    feeRate: 0,
    maxRate: 0,
    minRate: 0,
    stakeType: "UNSTAKED",
    liquidityType: "PROVIDED",
  }, {
    liquidityId: "#14451",
    tokenPair,
    fee: tokenPair,
    amount: "145541.10",
    feeRate: 0,
    maxRate: 0,
    minRate: 0,
    stakeType: "UNSTAKED",
    liquidityType: "PROVIDED",
  }, {
    liquidityId: "#14452",
    tokenPair,
    fee: tokenPair,
    amount: "145541.10",
    feeRate: 0,
    maxRate: 0,
    minRate: 0,
    stakeType: "STAKED",
    liquidityType: "PROVIDED",
  }, {
    liquidityId: "#14453",
    tokenPair,
    fee: tokenPair,
    amount: "145541.10",
    feeRate: 0,
    maxRate: 0,
    minRate: 0,
    stakeType: "STAKED",
    liquidityType: "PROVIDED",
  }
];

const Template: ComponentStory<typeof RemoveLiquiditySelectList> = args => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const unstakedLiquidities = useMemo(() => {
    return args.liquidities.filter(liquidity => liquidity.stakeType === "UNSTAKED");
  }, [args.liquidities]);

  const selectedAll = useMemo(() => {
    return unstakedLiquidities.length === selectedIds.length;
  }, [selectedIds.length, unstakedLiquidities.length]);

  const selectAll = useCallback(() => {
    if (selectedAll) {
      setSelectedIds([]);
      return;
    }
    const selectedIds = unstakedLiquidities.map(liquidity => liquidity.liquidityId);
    setSelectedIds(selectedIds);
  }, [selectedAll, unstakedLiquidities]);

  const select = useCallback((id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((selectedId => selectedId !== id)));
      return;
    }
    setSelectedIds([...selectedIds, id]);
  }, [selectedIds]);

  return (
    <RemoveLiquiditySelectList
      {...args}
      selectedAll={selectedAll}
      selectedIds={selectedIds}
      select={select}
      selectAll={selectAll}
    />
  );
};

export const Default = Template.bind({});
Default.args = {
  liquidities,
};
