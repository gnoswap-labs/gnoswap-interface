import SearchInput from "@components/common/search-input/SearchInput";
import { POOL_TYPE } from "@containers/pool-list-container/PoolListContainer";
import { css } from "@emotion/react";
import React, { useCallback, useState } from "react";

interface PoolListHeaderProps {
  poolType: POOL_TYPE;
  changePoolType: (newTokenType: POOL_TYPE) => void;
  search: (keyword: string) => void;
}

const PoolListHeader: React.FC<PoolListHeaderProps> = ({
  poolType,
  changePoolType,
  search,
}) => {
  const [keyword, setKeyword] = useState<string>("");

  const onSearch = useCallback(() => {
    if (keyword === "") return;

    search(keyword);
  }, [search, keyword]);

  const onClickAll = useCallback(() => {
    changePoolType(POOL_TYPE.ALL);
  }, [changePoolType]);

  const onClickIncentivized = useCallback(() => {
    changePoolType(POOL_TYPE.INCENTIVIZED);
  }, [changePoolType]);

  const onClickNonIncentivized = useCallback(() => {
    changePoolType(POOL_TYPE.NON_INCENTIVIZED);
  }, [changePoolType]);

  const onChangeSearchInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setKeyword(e.target.value);
    },
    [],
  );

  return (
    <div
      css={css`
        border: 1px solid green;
      `}
    >
      Pools
      <button
        onClick={onClickAll}
        disabled={poolType === POOL_TYPE.ALL}
        style={{
          border: poolType === POOL_TYPE.ALL ? "1px solid red" : "none",
        }}
      >
        ALL
      </button>
      <button
        onClick={onClickIncentivized}
        disabled={poolType === POOL_TYPE.INCENTIVIZED}
        style={{
          border:
            poolType === POOL_TYPE.INCENTIVIZED ? "1px solid red" : "none",
        }}
      >
        Incentivized
      </button>
      <button
        onClick={onClickNonIncentivized}
        disabled={poolType === POOL_TYPE.NON_INCENTIVIZED}
        style={{
          border:
            poolType === POOL_TYPE.NON_INCENTIVIZED ? "1px solid red" : "none",
        }}
      >
        Non-Incentivized
      </button>
      <button onClick={onSearch}>search</button>
      <SearchInput value={keyword} onChange={onChangeSearchInput} />
    </div>
  );
};

export default PoolListHeader;
