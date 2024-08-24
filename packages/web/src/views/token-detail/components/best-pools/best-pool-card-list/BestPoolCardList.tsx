import Link from "next/link";
import React from "react";
import { useTranslation } from "react-i18next";

import DoubleLogo from "@components/common/double-logo/DoubleLogo";
import IconStar from "@components/common/icons/IconStar";
import LoadingSpinner from "@components/common/loading-spinner/LoadingSpinner";
import { SwapFeeTierInfoMap, SwapFeeTierType } from "@constants/option.constant";
import { PAGE_PATH, QUERY_PARAMETER } from "@constants/page.constant";
import { formatRate } from "@utils/new-number-utils";
import { makeRouteUrl } from "@utils/page.utils";
import { tokenPairSymbolToOneCharacter } from "@utils/string-utils";

import { TokenPairInfo } from "@models/token/token-pair-info";
import { loadingWrapper, wrapper } from "./BestPoolCardList.styles";

export interface BestPool {
  tokenPair: TokenPairInfo;
  feeRate: SwapFeeTierType;
  tvl: string;
  apr: string;
  id: string;
  poolPath: string;
}

interface BestPoolCardListProps {
  list: BestPool[];
  loading: boolean;
}

const BestPoolCardList: React.FC<BestPoolCardListProps> = ({
  list,
  loading,
}) => {
  const { t } = useTranslation();

  const LIST_HEADER_INFO = [
    { title: "TokenDetails:bestPool.col.pair", class: "pair" },
    { title: "TokenDetails:bestPool.col.tvl", class: "tvl" },
    { title: "TokenDetails:bestPool.col.apr", class: "apr" },
  ];

  return (
    <div css={wrapper}>
      <div className="title-wrap">
        {LIST_HEADER_INFO.map((item, idx) => (
          <span key={idx} className={item.class}>
            {t(item.title)}
          </span>
        ))}
      </div>
      {loading && (
        <div css={loadingWrapper}>
          <LoadingSpinner />
        </div>
      )}
      {!loading && list.length === 0 && (
        <div css={loadingWrapper}>
          <span>No data</span>
        </div>
      )}
      {!loading && (
        <ul>
          {list.map((info, idx) => (
            <Link
              href={makeRouteUrl(PAGE_PATH.POOL, {
                [QUERY_PARAMETER.POOL_PATH]: info.id,
              })}
              key={idx}
            >
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
                  <span className="fee-rate">
                    {SwapFeeTierInfoMap[info.feeRate].rateStr}
                  </span>
                </div>
                <span className="tvl">{info.tvl}</span>
                <span className="apr">
                  {Number(info.apr) > 100 && <IconStar size={20} />}
                  {formatRate(info.apr)}
                </span>
              </li>
            </Link>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BestPoolCardList;
