import React, { useMemo } from "react";
import SearchInput from "@components/common/search-input/SearchInput";
import SelectTab from "@components/common/select-tab/SelectTab";
import { POOL_TYPE } from "@containers/pool-list-container/PoolListContainer";
import { PoolHeaderWrapper } from "./PoolListHeader.styles";
import { DEVICE_TYPE } from "@styles/media";
import IconSearch from "@components/common/icons/IconSearch";

interface PoolListHeaderProps {
  poolType: POOL_TYPE;
  changePoolType: (newType: string) => void;
  search: (e: React.ChangeEvent<HTMLInputElement>) => void;
  keyword: string;
  breakpoint: DEVICE_TYPE;
  searchIcon: boolean;
  onTogleSearch: () => void;
  searchRef: React.RefObject<HTMLDivElement>;
}

const PoolListHeader: React.FC<PoolListHeaderProps> = ({
  poolType,
  changePoolType,
  search,
  keyword,
  breakpoint,
  searchIcon,
  onTogleSearch,
  searchRef,
}) => {
  const searchInputWidth = useMemo(() => {
    if (breakpoint === DEVICE_TYPE.WEB) return 300;
    if (breakpoint === DEVICE_TYPE.TABLET_M) return 180;

    return 250;
  }, [breakpoint]);

  return (
    <PoolHeaderWrapper>
      <div className="title-container">
        <h2>Pools</h2>
        {breakpoint !== DEVICE_TYPE.MOBILE ? (
          <SelectTab
            selectType={poolType}
            list={Object.values(POOL_TYPE)}
            onClick={changePoolType}
          />
        ) : searchIcon ? (
          <div ref={searchRef as unknown as React.RefObject<HTMLDivElement>}>
            <SearchInput
              width={200}
              height={40}
              value={keyword}
              onChange={search}
              className="tokens-search"
            />
          </div>
        ) : (
          <div className="icon-wrap" onClick={onTogleSearch}>
            <IconSearch className="search-icon" />
          </div>
        )}
      </div>
      {breakpoint !== DEVICE_TYPE.MOBILE ? (
        <SearchInput
          width={searchInputWidth}
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
};

export default PoolListHeader;
