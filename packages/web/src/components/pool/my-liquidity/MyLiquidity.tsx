import React from "react";
import MyLiquidityContent from "@components/pool/my-liquidity-content/MyLiquidityContent";
import MyLiquidityHeader from "@components/pool/my-liquidity-header/MyLiquidityHeader";
import { PoolDivider, MyLiquidityWrapper, MyLiquidityWrapperAnchor } from "./MyLiquidity.styles";
import { DEVICE_TYPE } from "@styles/media";
import MyPositionCard from "../my-position-card/MyPositionCard";
import { PoolPositionModel } from "@models/position/pool-position-model";
import { TokenPriceModel } from "@models/token/token-price-model";

interface MyLiquidityProps {
  address: string | null;
  addressName: string;
  isOtherPosition: boolean;
  positions: PoolPositionModel[]
  breakpoint: DEVICE_TYPE;
  connected: boolean;
  isSwitchNetwork: boolean;
  handleClickAddPosition: () => void;
  handleClickRemovePosition: () => void;
  divRef: React.RefObject<HTMLDivElement>;
  onScroll: () => void;
  currentIndex: number;
  claimAll: () => void;
  isShowRemovePositionButton: boolean;
  loading: boolean;
  loadingTransactionClaim: boolean;
  isShowClosePosition: boolean;
  handleSetIsClosePosition: () => void;
  isHiddenAddPosition: boolean;
  showClosePositionButton: boolean;
  tokenPrices: Record<string, TokenPriceModel>;
}

const MyLiquidity: React.FC<MyLiquidityProps> = ({
  isOtherPosition,
  address,
  addressName,
  positions,
  breakpoint,
  connected,
  isSwitchNetwork,
  handleClickAddPosition,
  handleClickRemovePosition,
  divRef,
  onScroll,
  currentIndex,
  claimAll,
  isShowRemovePositionButton,
  loading,
  loadingTransactionClaim,
  isShowClosePosition,
  handleSetIsClosePosition,
  isHiddenAddPosition,
  showClosePositionButton,
  tokenPrices,
}) => {
  return (
    <>
      <MyLiquidityWrapper>
        <MyLiquidityWrapperAnchor id={"liquidity-wrapper"} />
        <div className="liquidity-wrap">
          <MyLiquidityHeader
            isOtherPosition={isOtherPosition}
            connectedWallet={connected}
            address={address}
            addressName={addressName}
            positionLength={positions.length}
            isShowRemovePositionButton={isShowRemovePositionButton}
            handleClickAddPosition={handleClickAddPosition}
            handleClickRemovePosition={handleClickRemovePosition}
            isShowClosePosition={isShowClosePosition}
            handleSetIsClosePosition={handleSetIsClosePosition}
            isHiddenAddPosition={isHiddenAddPosition}
            showClosePositionButton={showClosePositionButton}
            isLoadingPositionsById={loading}
          />
          <MyLiquidityContent
            connected={connected}
            positions={positions}
            breakpoint={breakpoint}
            isDisabledButton={isSwitchNetwork || !connected}
            claimAll={claimAll}
            loadingTransactionClaim={loadingTransactionClaim}
            isOtherPosition={isHiddenAddPosition}
            isLoadingPositionsById={loading}
            tokenPrices={tokenPrices}
          />
        </div>
        {positions.length > 0 && <PoolDivider />}
        {breakpoint !== DEVICE_TYPE.MOBILE ? (
          positions.map((position: PoolPositionModel, index: number) => (
            <MyPositionCard
              position={position}
              key={index.toString() + position.id}
              breakpoint={breakpoint}
              loading={loading}
              address={address || ""}
              isHiddenAddPosition={isHiddenAddPosition}
              connected={connected}
              tokenPrices={tokenPrices}
            />
          ))
        ) : (
          <>
            <div className="slider-wrap clearfix" ref={divRef} onScroll={onScroll}>
              <div className={"box-slider full-width"}>
                {positions.map((position: PoolPositionModel, index: number) => (
                  <MyPositionCard
                    position={position}
                    key={index.toString() + position.id}
                    breakpoint={breakpoint}
                    loading={loading}
                    address={address || ""}
                    isHiddenAddPosition={isHiddenAddPosition}
                    connected={connected}
                    tokenPrices={tokenPrices}
                  />
                ))}
              </div>
            </div>
            {positions.length > 1 && <div className="box-indicator">
              <span className="current-page">{currentIndex}</span>
              <span>/</span>
              <span>{positions.length}</span>
            </div>}
          </>
        )}
      </MyLiquidityWrapper>
    </>
  );
};

export default MyLiquidity;
