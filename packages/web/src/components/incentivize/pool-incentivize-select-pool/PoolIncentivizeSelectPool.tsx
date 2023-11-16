import React, { useCallback, useMemo, useState } from "react";
import { PoolIncentivizeSelectPoolBox, PoolIncentivizeSelectPoolWrapper } from "./PoolIncentivizeSelectPool.styles";
import PoolIncentivizeSelectPoolItem from "../pool-incentivize-select-pool-item/PoolIncentivizeSelectPoolItem";
import SearchInput from "@components/common/search-input/SearchInput";
import IconArrowDown from "@components/common/icons/IconArrowDown";
import IconArrowUp from "@components/common/icons/IconArrowUp";
import { PoolSelectItemInfo } from "@models/pool/info/pool-select-item-info";

export interface PoolIncentivizeSelectPoolProps {
  selectedPool: PoolSelectItemInfo | null;
  pools: PoolSelectItemInfo[];
  select: (poolId: string) => void;
  isDisabled?: boolean;
}

const PoolIncentivizeSelectPool: React.FC<PoolIncentivizeSelectPoolProps> = ({
  selectedPool,
  pools,
  select,
  isDisabled,
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
      const tokenA = pool.tokenA;
      const tokenB = pool.tokenB;
      if (
        tokenA.name.toUpperCase().includes(upperSearchKeyword) ||
        tokenA.symbol.toUpperCase().includes(upperSearchKeyword)) {
        return true;
      }
      if (
        tokenB.name.toUpperCase().includes(upperSearchKeyword) ||
        tokenB.symbol.toUpperCase().includes(upperSearchKeyword)) {
        return true;
      }
      return false;
    });
  }, [searchKeyword, pools]);

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
    <PoolIncentivizeSelectPoolWrapper isDisabled={isDisabled}>
      <h5>1. Select Pool</h5>
      <div className="pool-select-wrapper" onClick={toggleSelector}>
        <PoolIncentivizeSelectPoolItem
          poolSelectItem={selectedPool}
          visibleLiquidity={false}
          select={toggleSelector}
        />
        {!isDisabled && <div className="icon-wrapper">
          {openedSelector ?
            <IconArrowUp className="icon-arrow" /> :
            <IconArrowDown className="icon-arrow" />}
        </div>}

        <PoolIncentivizeSelectPoolBox className={openedSelector ? "open" : ""}>
          <div className="search-wrapper" onClick={e => e.stopPropagation()}>
            <SearchInput
              onChange={onChangeKeyword}
              placeholder="Search by Name, Symbol, or Path"
            />
          </div>
          <div className="pool-list-wrapper">
            <div className="pool-list-headrer">
              <span className="total-info">Pools</span>
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
      </div>
    </PoolIncentivizeSelectPoolWrapper>
  );
};

export default PoolIncentivizeSelectPool;