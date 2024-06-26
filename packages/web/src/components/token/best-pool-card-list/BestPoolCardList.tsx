import React from "react";
import DoubleLogo from "@components/common/double-logo/DoubleLogo";
import { type BestPool } from "@containers/best-pools-container/BestPoolsContainer";
import { numberToRate, tokenPairSymbolToOneCharacter } from "@utils/string-utils";
import { loadingWrapper, wrapper } from "./BestPoolCardList.styles";
import Link from "next/link";
import { SwapFeeTierInfoMap } from "@constants/option.constant";
import LoadingSpinner from "@components/common/loading-spinner/LoadingSpinner";
import IconStar from "@components/common/icons/IconStar";

interface BestPoolCardListProps {
  list: BestPool[];
  loading: boolean;
}

const LIST_TITLE = ["Pair", "TVL", "APR"];

const BestPoolCardList: React.FC<BestPoolCardListProps> = ({ list, loading }) => {

  return (
    <div css={wrapper}>
      <div className="title-wrap">
        {LIST_TITLE.map((item, idx) => (
          <span key={idx} className={item.toLowerCase()}>
            {item}
          </span>
        ))}
      </div>
      {loading && <div css={loadingWrapper}>
        <LoadingSpinner />
      </div>}
      {!loading && list.length === 0 && <div css={loadingWrapper}>
        <span>No data</span>
      </div>}
      {!loading && <ul>
        {list.map((info, idx) => (
          <Link href={`/earn/pool/${info.id}`} key={idx}>
            <li>
              <div className="pair">
                <DoubleLogo
                  left={info.tokenPair.tokenA.logoURI}
                  right={info.tokenPair.tokenB.logoURI}
                  size={20}
                  leftSymbol={info.tokenPair.tokenA.symbol}
                  rightSymbol={info.tokenPair.tokenB.symbol}
                />
                <span className="symbol">
                  {tokenPairSymbolToOneCharacter(info.tokenPair)}
                </span>
                <span className="fee-rate">{SwapFeeTierInfoMap[info.feeRate].rateStr}</span>
              </div>
              <span className="tvl">{info.tvl}</span>
              <span className="apr">
                {Number(info.apr) > 100 && <IconStar size={20} />}
                {numberToRate(info.apr)}
              </span>
            </li>
          </Link>
        ))}
      </ul>}
    </div>
  );
};

export default BestPoolCardList;
