import RemoveLiquidity from "@components/remove/remove-liquidity/RemoveLiquidity";
import React, { useCallback, useMemo, useState } from "react";
import { LiquidityInfoModel } from "@models/liquidity/liquidity-info-model";
import BigNumber from "bignumber.js";


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

const dummyLiquidities: LiquidityInfoModel[] = [
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

const RemoveLiquidityContainer: React.FC = () => {
  const [liquidities] = useState<LiquidityInfoModel[]>(dummyLiquidities);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const unstakedLiquidities = useMemo(() => {
    return liquidities.filter(liquidity => liquidity.stakeType === "UNSTAKED");
  }, [liquidities]);

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

  const removeLiquidity = useCallback(() => {
    console.log("removeLiquidity");
  }, []);

  return (
    <RemoveLiquidity
      liquidities={liquidities}
      selectedAll={selectedAll}
      selectedIds={selectedIds}
      select={select}
      selectAll={selectAll}
      removeLiquidity={removeLiquidity}
    />
  );
};

export default RemoveLiquidityContainer;
