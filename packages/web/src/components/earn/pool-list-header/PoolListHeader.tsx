import React from "react";
import SearchInput from "@components/common/search-input/SearchInput";
import SelectTab from "@components/common/select-tab/SelectTab";
import { POOL_TYPE } from "@containers/pool-list-container/PoolListContainer";
import { wrapper } from "./PoolListHeader.styles";

interface PoolListHeaderProps {
  poolType: POOL_TYPE;
  changePoolType: (newType: string) => void;
  search: (e: React.ChangeEvent<HTMLInputElement>) => void;
  keyword: string;
}

const PoolListHeader: React.FC<PoolListHeaderProps> = ({
  poolType,
  changePoolType,
  search,
  keyword,
}) => (
  <div css={wrapper}>
    <h2>Pools</h2>
    <SelectTab
      selectType={poolType}
      list={Object.values(POOL_TYPE)}
      onClick={changePoolType}
    />
    <SearchInput
      width={300}
      value={keyword}
      onChange={search}
      className="pools-search"
    />
  </div>
);

export default PoolListHeader;
