import RemoveLiquidity from "@components/remove/remove-liquidity/RemoveLiquidity";
import React, { useCallback, useEffect, useMemo, useState } from "react";
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
      "path": "gno.land/r/bar:gno.land/r/foo:300",
      "name": "ETH-swETH",
      "incentivizedType": "INCENTIVIZED",
      "tokenA": {
        "type": "grc20",
        "chainId": "dev.gnoswap",
        "createdAt": "2023-12-08T03:57:43Z",
        "name": "Foo",
        "path": "gno.land/r/foo",
        "decimals": 4,
        "symbol": "FOO",
        "logoURI": "https://raw.githubusercontent.com/onbloc/gno-token-resource/main/grc20/images/gno_land_r_foo.svg",
        "priceId": "gno.land/r/foo",
        "address": ""
      },
      "tokenB": {
        "type": "grc20",
        "chainId": "dev.gnoswap",
        "createdAt": "2023-12-08T03:57:43Z",
        "name": "Foo",
        "path": "gno.land/r/foo",
        "decimals": 4,
        "symbol": "FOO",
        "logoURI": "https://raw.githubusercontent.com/onbloc/gno-token-resource/main/grc20/images/gno_land_r_foo.svg",
        "priceId": "gno.land/r/foo",
        "address": ""
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
        "type": "grc20",
        "chainId": "dev.gnoswap",
        "createdAt": "2023-12-08T03:57:43Z",
        "name": "Foo",
        "path": "gno.land/r/foo",
        "decimals": 4,
        "symbol": "FOO",
        "logoURI": "https://raw.githubusercontent.com/onbloc/gno-token-resource/main/grc20/images/gno_land_r_foo.svg",
        "priceId": "gno.land/r/foo",
        "address": ""
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
  } as LPPositionModel;
});

const RemoveLiquidityContainer: React.FC = () => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const { width } = useWindowSize();
  const { openModal } = useRemovePositionModal();
  const [positions, setPositions] = useState<PoolPositionModel[]>([]);
  const { getPositions } = usePositionData();

  useEffect(() => {
    getPositions().then(setPositions);
  }, [getPositions]);

  const unstakedLiquidities = useMemo(() => {
    return positions.filter(item => item.unclaimedFee0Amount + item.unclaimedFee1Amount > 0);
  }, [positions]);

  const selectedAll = useMemo(() => {
    return unstakedLiquidities.length === selectedIds.length;
  }, [selectedIds.length, unstakedLiquidities.length]);

  const selectAll = useCallback(() => {
    if (selectedAll) {
      setSelectedIds([]);
      return;
    }
    const selectedIds = unstakedLiquidities.map(liquidity => liquidity.id);
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
      positions={positions}
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
