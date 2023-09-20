import React, { useCallback, useMemo, useState } from "react";
import { PoolIncentivizeSelectPoolBox, PoolIncentivizeSelectPoolWrapper } from "./PoolIncentivizeSelectPool.styles";
import { PoolSelectItemModel } from "@models/pool/pool-select-item-model";
import PoolIncentivizeSelectPoolItem from "../pool-incentivize-select-pool-item/PoolIncentivizeSelectPoolItem";
import SearchInput from "@components/common/search-input/SearchInput";
import IconArrowDown from "@components/common/icons/IconArrowDown";
import IconArrowUp from "@components/common/icons/IconArrowUp";

export interface PoolIncentivizeSelectPoolProps {
  selectedPool: PoolSelectItemModel | null;
  pools: PoolSelectItemModel[];
  select: (poolId: string) => void;
}

const PoolIncentivizeSelectPool: React.FC<PoolIncentivizeSelectPoolProps> = ({
  selectedPool,
  pools,
  select
}) => {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [openedSelector, setOpenedSelector] = useState(false);

  const filteredPools = useMemo(() => {
    if (searchKeyword === "") {
      return pools;
    }
    const upperSearchKeyword = searchKeyword.toUpperCase();

    return pools.filter(pool => {
      if (pool.poolId.includes(searchKeyword)) {
        return true;
      }
      const token0 = pool.tokenPair.token0;
      const token1 = pool.tokenPair.token1;
      if (
        token0.name.toUpperCase().includes(upperSearchKeyword) ||
        token0.symbol.toUpperCase().includes(upperSearchKeyword)) {
        return true;
      }
      if (
        token1.name.toUpperCase().includes(upperSearchKeyword) ||
        token1.symbol.toUpperCase().includes(upperSearchKeyword)) {
        return true;
      }
      return false;
    });
  }, [searchKeyword, pools]);

  const totalInfo = useMemo(() => {
    return `Total ${filteredPools.length} Pools`;
  }, [filteredPools.length]);

  const toggleSelector = useCallback(() => {
    setOpenedSelector(!openedSelector);
  }, [openedSelector]);

  const selectPoolItem = useCallback((poolId: string) => {
    select(poolId);
    setOpenedSelector(false);
  }, [select]);

  const onChangeKeyword = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchKeyword(event.target.value);
  }, []);

  return (
    <PoolIncentivizeSelectPoolWrapper>
      <h5>1. Select Pool</h5>
      <div className="pool-select-wrapper" onClick={toggleSelector}>
        <PoolIncentivizeSelectPoolItem
          poolSelectItem={selectedPool}
          visibleLiquidity={false}
          select={toggleSelector}
        />
        <div className="icon-wrapper">
          {openedSelector ?
            <IconArrowUp className="icon-arrow" /> :
            <IconArrowDown className="icon-arrow" />}
        </div>

        {openedSelector && (
          <PoolIncentivizeSelectPoolBox>
            <div className="search-wrapper" onClick={e => e.stopPropagation()}>
              <SearchInput
                onChange={onChangeKeyword}
                placeholder="Search name or paste address"
              />
            </div>
            <div className="pool-list-wrapper">
              <div className="pool-list-headrer">
                <span className="total-info">{totalInfo}</span>
                <span className="liquidity-info">Liquidity</span>
              </div>
              <div className="pool-list-content">
                {filteredPools.map((pool, index) => (
                  <PoolIncentivizeSelectPoolItem
                    key={index}
                    poolSelectItem={pool}
                    visibleLiquidity={true}
                    select={selectPoolItem}
                  />
                ))}
              </div>
            </div>
          </PoolIncentivizeSelectPoolBox>
        )}
      </div>
    </PoolIncentivizeSelectPoolWrapper>
  );
};

export default PoolIncentivizeSelectPool;