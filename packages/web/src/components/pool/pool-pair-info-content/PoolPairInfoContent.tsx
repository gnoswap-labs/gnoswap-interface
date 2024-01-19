import React, { useMemo } from "react";
import {
  AprDivider,
  PoolPairInfoContentWrapper,
} from "./PoolPairInfoContent.styles";
import IconStar from "@components/common/icons/IconStar";
import { PoolDetailModel } from "@models/pool/pool-detail-model";
import { numberToFormat } from "@utils/string-utils";
import { SkeletonEarnDetailWrapper } from "@layouts/pool-layout/PoolLayout.styles";
import { pulseSkeletonStyle } from "@constants/skeleton.constant";
import { formatUsdNumber } from "@utils/stake-position-utils";
interface PoolPairInfoContentProps {
  pool: PoolDetailModel;
  loading: boolean;
}

const PoolPairInfoContent: React.FC<PoolPairInfoContentProps> = ({
  pool,
  loading,
}) => {
  const liquidityValue = useMemo((): string => {
    return formatUsdNumber(Number(pool.tvl).toString(), undefined, true);
  }, [pool.tvl]);
  
  const volumeValue = useMemo((): string => {
    return formatUsdNumber(Number(pool.volume).toString(), undefined, true);
  }, [pool.volume]);

  const aprValue = useMemo(() => {
    if (!pool.apr) {
      return "-";
    }
    if (Number(pool.apr) >= 100) {
      return <><IconStar />{`${pool.apr}%`}</>;
    }
    return `${pool.apr}%`;
  }, [pool.apr]);

  const liquidityChangedStr = useMemo((): string => {
    return `${numberToFormat(pool.tvlChange, 2)}%`;
  }, [pool.tvlChange]);

  const volumeChangedStr = useMemo((): string => {
    return `${numberToFormat(pool.volumeChange, 2)}%`;
  }, [pool.volumeChange]);

  const feeChangedStr = useMemo((): string => {
    return `${numberToFormat(pool.feeChange, 2)}%`;
  }, [pool.feeChange]);

  const rewardChangedStr = useMemo((): string => {
    return "0.00%";
  }, []);

  return (
    <PoolPairInfoContentWrapper>
      <section>
        <h4>TVL</h4>
        {loading && <SkeletonEarnDetailWrapper height={39} mobileHeight={25}>
          <span
            css={pulseSkeletonStyle({ h: 22, w:"170px" ,smallTableWidth : 140} )}
          />
          </SkeletonEarnDetailWrapper>}
        {!loading && <strong>{liquidityValue}</strong>}
        <div className="section-info">
          <span>24h Change</span>
          {loading && <SkeletonEarnDetailWrapper height={18} mobileHeight={18}>
            <span
              css={pulseSkeletonStyle({ h: 22, w:"50px"})}
            />
            </SkeletonEarnDetailWrapper>}
          {!loading && pool.tvlChange >= 0 ? (
            <span className="positive">+{liquidityChangedStr}</span>
          ) : (!loading &&
            <span className="negative">-{liquidityChangedStr}</span>
          )}
        </div>
      </section>
      <section>
        <h4>Volume (24h)</h4>
        {!loading &&<strong>{volumeValue}</strong>}
        {loading && <SkeletonEarnDetailWrapper height={39} mobileHeight={25}>
            <span
              css={pulseSkeletonStyle({ h: 22, w:"170px" ,smallTableWidth : 140})}
            />
            </SkeletonEarnDetailWrapper>}
        <div className="section-info">
          <span>24h Change</span>
          {!loading && pool.volumeChange >= 0 ? (
            <span className="positive">+{volumeChangedStr}</span>
          ) : (!loading &&
            <span className="negative">-{volumeChangedStr}</span>
          )}
          {loading && <SkeletonEarnDetailWrapper height={18} mobileHeight={18}>
            <span
              css={pulseSkeletonStyle({ h: 22, w:"50px"})}
            />
          </SkeletonEarnDetailWrapper>}
        </div>
      </section>
      <section>
        <h4>APR</h4>
        {!loading && <strong>{aprValue}</strong>}
        {loading && <SkeletonEarnDetailWrapper height={39} mobileHeight={25}>
        <span
          css={pulseSkeletonStyle({ h: 22, w:"170px"})}
        />
        </SkeletonEarnDetailWrapper>}
        <div className="apr-info">
          <div className="content-wrap">
            <span>Fees</span>
            {!loading && <span className="apr-value">{feeChangedStr}</span>}
            {loading && <SkeletonEarnDetailWrapper height={18} mobileHeight={18}>
            <span
              css={pulseSkeletonStyle({ h: 22, w:"50px"})}
            />
            </SkeletonEarnDetailWrapper>}
          </div>
          <AprDivider />
          <div className="content-wrap">
            <span>Rewards</span>
            {!loading && <span className="apr-value">{rewardChangedStr}</span>}
            {loading && <SkeletonEarnDetailWrapper height={18} mobileHeight={18}>
            <span
              css={pulseSkeletonStyle({ h: 22, w:"50px"})}
            />
            </SkeletonEarnDetailWrapper>}
          </div>
        </div>
      </section>
    </PoolPairInfoContentWrapper>
  );
};

export default PoolPairInfoContent;
