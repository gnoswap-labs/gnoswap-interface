import React from "react";
import DoubleLogo from "@components/common/double-logo/DoubleLogo";
import { type BestPool } from "@containers/best-pools-container/BestPoolsContainer";
import { tokenPairSymbolToOneCharacter } from "@utils/string-utils";
import { loadingWrapper, wrapper } from "./BestPoolCardList.styles";
import Link from "next/link";
import { SwapFeeTierInfoMap } from "@constants/option.constant";
import LoadingSpinner from "@components/common/loading-spinner/LoadingSpinner";

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
      {!loading && <ul>
        {list.map((info, idx) => (
          <Link href="/earn/pool/5" key={idx}>
            <li>
              <div>
                <DoubleLogo
                  left={info.tokenPair.tokenA.logoURI}
                  right={info.tokenPair.tokenB.logoURI}
                  size={20}
                />
                <span className="symbol">
                  {tokenPairSymbolToOneCharacter(info.tokenPair)}
                </span>
                <span className="fee-rate">{SwapFeeTierInfoMap[info.feeRate].rateStr}</span>
              </div>
              <span className="tvl">{info.tvl}</span>
              <span className="apr">{info.apr}</span>
            </li>
          </Link>
        ))}
      </ul>}
    </div>
  );
};

export default BestPoolCardList;
