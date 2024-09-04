import Link from "next/link";
import React from "react";
import { useTranslation } from "react-i18next";

import Button, { ButtonHierarchy } from "@components/common/button/Button";
import IconAdd from "@components/common/icons/IconAdd";
import IconStar from "@components/common/icons/IconStar";
import MissingLogo from "@components/common/missing-logo/MissingLogo";
import { PAGE_PATH, QUERY_PARAMETER } from "@constants/page.constant";
import { TokenModel } from "@models/token/token-model";
import { formatRate } from "@utils/new-number-utils";

import {
  LiquidityInfo,
  LIQUIDITY_HEAD,
} from "@views/swap/containers/swap-liquidity-container/SwapLiquidityContainer";

import { SwapLiquidityWrapper } from "./SwapLiquidity.styles";

interface SwapLiquidityProps {
  liquiditys: LiquidityInfo[];
  tokenA: TokenModel;
  tokenB: TokenModel;
  createPool: () => void;
}

const getPathname = (liquidity: LiquidityInfo) => {
  return {
    pathname: `${PAGE_PATH.POOL}?${QUERY_PARAMETER.POOL_PATH}=${liquidity.id}`,
    as: `${PAGE_PATH.POOL}?${QUERY_PARAMETER.POOL_PATH}=${liquidity.id}`,
  };
};

const SwapLiquidity: React.FC<SwapLiquidityProps> = ({
  liquiditys,
  tokenA,
  tokenB,
  createPool,
}) => {
  const { t } = useTranslation();

  return (
    <SwapLiquidityWrapper>
      <div className="box-header">
        <div className="coin-pair">
          <div className="gnos-image-wrapper">
            <MissingLogo
              symbol={tokenA.symbol}
              url={tokenA.logoURI}
              className="coin-logo"
              width={24}
              mobileWidth={24}
            />
          </div>
          <div className="gnot-image-wrapper">
            <MissingLogo
              symbol={tokenB.symbol}
              url={tokenB.logoURI}
              className="coin-logo"
              width={24}
              mobileWidth={24}
            />
          </div>
        </div>
        <span>
          {tokenA.symbol}/{tokenB.symbol}
        </span>
      </div>
      {liquiditys.length === 0 ? (
        <div className="list-wrap">
          <p dangerouslySetInnerHTML={{ __html: t("Swap:poolInfo.noPool") }} />
          <Button
            text={t("Swap:poolInfo.addPosBtn")}
            leftIcon={<IconAdd />}
            style={{
              fullWidth: true,
              gap: 8,
              height: 44,
              fontType: "body9",
              hierarchy: ButtonHierarchy.Primary,
            }}
            onClick={createPool}
          />
        </div>
      ) : (
        <div className="liquidity-list">
          <div className="th">
            {Object.values(LIQUIDITY_HEAD).map((head, idx) => (
              <span
                key={idx}
                className={Object.keys(LIQUIDITY_HEAD)[idx].toLowerCase()}
              >
                {t(head)}
              </span>
            ))}
          </div>
          {liquiditys.map((liquidity, idx) => {
            const obj = getPathname(liquidity);
            const showStar = Number(liquidity.apr) > 100;

            return (
              <Link
                href={obj.pathname}
                as={obj.as}
                key={idx}
                className={`${!liquidity.active ? "inacitve-liquidity" : ""}`}
              >
                <div
                  className={`fee-info ${
                    !liquidity.active ? "inacitve-liquidity" : ""
                  }`}
                >
                  <span className="badge-wrap">
                    <div className="badge">{liquidity.feeTier}%</div>
                  </span>
                  <span className="volume">{liquidity.volume}</span>
                  <span className="liquidity">{liquidity.liquidity}</span>
                  <span className="apr">
                    {showStar && <IconStar size={20} />}
                    {formatRate(liquidity.apr)}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </SwapLiquidityWrapper>
  );
};

export default SwapLiquidity;
