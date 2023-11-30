import RemoveLiquidity from "@components/remove/remove-liquidity/RemoveLiquidity";
import React, { useCallback, useMemo, useState } from "react";
import { LPPositionModel } from "@models/position/lp-position-model";
import { useRemovePositionModal } from "@hooks/earn/use-remove-position-modal";
import { useWindowSize } from "@hooks/common/use-window-size";

const MOCK_DATA = {
  "apr": 0.04483021186938406,
  "lpRewardId": "14450",
  "position": {
    "balance": 760102.5916965322,
    "volume": 803845.101127504,
    "volumeA": 380.9675639393881,
    "volumeB": 121.96265488561838,
    "feeAPR": 0.0063689886266131285,
    "feesA": 0.07619351278787763,
    "feesAUSD": 121.43264907055209,
    "feesBUSD": 39.33637115494873,
    "feesB": 0.024392530977123676,
    "fees": 160.7690202255008,
    "bins": [],
    "id": "0x7a80x0ce176e1b11a8f88a4ba2535de80e81f88592bad",
    "nftId": "0x7a8",
    "pool": {
      "name": "ETH-swETH",
      "tokenA": {
        "name": "Ether",
        "address": "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
        "path": "gno.land/r/demo/eth",
        "symbol": "ETH",
        "decimals": 6,
        "chainId": "test3",
        "priceId": "ethereum",
        "isGasToken": true,
        "logoURI": "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x2b591e99afE9f32eAA6214f7B7629768c40Eeb39/logo.png",
        "createdAt": "1999-01-01T00:00:00Z"
      },
      "tokenB": {
        "chainId": "test3",
        "name": "swETH",
        "address": "0xf951E335afb289353dc249e82926178EaC7DEd78",
        "path": "gno.land/r/demo/sweth",
        "decimals": 6,
        "symbol": "swETH",
        "logoURI": "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png",
        "priceId": "sweth",
        "createdAt": "1999-01-01T00:00:00Z"
      },
      "tvl": 2367720.6946660844,
      "tvlChange": 0,
      "volume": 0,
      "volumeChange": 0.4222374881117897,
      "totalVolume": 3103122102.2697988,
      "id": "0xd0b2f5018b5d22759724af6d4281ac0b13266360",
      "fee": "0.00002",
      "feeVolume": 1563.3775664056654,
      "feeChange": 0.42223748811178985,
      "currentTick": -1,
      "[ANF] price": 0.9999619903866392,
      "tokenABalance": 648682.5470470262,
      "tokenBBalance": 1718920.6115409774,
      "tickSpacing": 2,
      "price": 123,
      "bins": [],
      "apr": 128.7
    },
    "reserveA": 112.61356909355652,
    "reserveB": 360.0467817301862
  },
  "rewards": [
    {
      "rewardId": "#14450",
      "rewardType": "internal",
      "poolTier": 1,
      "poolRatio": 0.7,
      "stakingTier": 1,
      "finishAt": 999999999,
      "rewardBalance": 0.7354098495365948,
      "token": {
        "chainId": "test3",
        "name": "swETH",
        "address": "0xf951E335afb289353dc249e82926178EaC7DEd78",
        "path": "gno.land/r/demo/123",
        "decimals": 6,
        "symbol": "swETH",
        "logoURI": "sweth.jpeg",
        "priceId": "sweth",
        "createdAt": "1999-01-01T00:00:00Z"
      },
      "tokenPrice": 1612.64,
      "totalRewardsPerDay": 80.09445333328517,
      "lpTokenId": "1"
    }
  ]
};

const LIST_DATA: LPPositionModel[] = [1, 2, 3, 4].map((item) => {
  return {
    ...MOCK_DATA,
    lpRewardId: (Number(MOCK_DATA.lpRewardId) + item).toString(),
    position: item > 2 ? { ...MOCK_DATA.position, balance: 0 } : MOCK_DATA.position,
  };
});

const RemoveLiquidityContainer: React.FC = () => {
  const [lpPositions] = useState<LPPositionModel[]>(LIST_DATA);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const { width } = useWindowSize();

  const { openModal } = useRemovePositionModal();

  const unstakedLiquidities = useMemo(() => {
    return lpPositions.filter(item => item.position.balance !== 0);
  }, [lpPositions]);

  const selectedAll = useMemo(() => {
    return unstakedLiquidities.length === selectedIds.length;
  }, [selectedIds.length, unstakedLiquidities.length]);

  const selectAll = useCallback(() => {
    if (selectedAll) {
      setSelectedIds([]);
      return;
    }
    const selectedIds = unstakedLiquidities.map(liquidity => liquidity.lpRewardId);
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
    openModal();
  }, []);

  return (
    <RemoveLiquidity
      lpPositions={lpPositions}
      selectedAll={selectedAll}
      selectedIds={selectedIds}
      select={select}
      selectAll={selectAll}
      removeLiquidity={removeLiquidity}
      width={width}
    />
  );
};

export default RemoveLiquidityContainer;
