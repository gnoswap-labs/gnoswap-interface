import React from "react";
import SearchInput from "@components/common/search-input/SearchInput";
import SelectTab from "@components/common/select-tab/SelectTab";
import { POOL_TYPE } from "@containers/pool-list-container/PoolListContainer";
import { PoolHeaderWrapper } from "./PoolListHeader.styles";
import { DeviceSize } from "@styles/media";
import IconSearch from "@components/common/icons/IconSearch";

interface PoolListHeaderProps {
  poolType: POOL_TYPE;
  changePoolType: (newType: string) => void;
  search: (e: React.ChangeEvent<HTMLInputElement>) => void;
  keyword: string;
  windowSize: number;
  searchIcon: boolean;
  onTogleSearch: () => void;
}

const PoolListHeader: React.FC<PoolListHeaderProps> = ({
  poolType,
  changePoolType,
  search,
  keyword,
  windowSize,
  searchIcon,
  onTogleSearch,
}) => (
  <PoolHeaderWrapper>
    <div className="title-container">
      <h2>Pools</h2>
      {windowSize > DeviceSize.mobile ? (
        <SelectTab
          selectType={poolType}
          list={Object.values(POOL_TYPE)}
          onClick={changePoolType}
        />
      ) : searchIcon ? (
        <SearchInput
          width={200}
          height={40}
          value={keyword}
          onChange={search}
          className="tokens-search"
        />
      ) : (
        <div className="icon-wrap" onClick={onTogleSearch}>
          <IconSearch className="search-icon" />
        </div>
      )}
    </div>
    {windowSize > DeviceSize.mobile ? (
      <SearchInput
        width={windowSize > DeviceSize.tablet ? 300 : 250}
        value={keyword}
        onChange={search}
        className="pools-search"
      />
    ) : (
      <SelectTab
        selectType={poolType}
        list={Object.values(POOL_TYPE)}
        onClick={changePoolType}
      />
    )}
  </PoolHeaderWrapper>
);

export default PoolListHeader;
