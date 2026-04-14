import React, { useMemo } from "react";

import LoadMoreButton from "@components/common/load-more-button/LoadMoreButton";
import { PoolPositionModel } from "@models/position/pool-position-model";
import { TokenPriceModel } from "@models/token/token-price-model";
import { DEVICE_TYPE } from "@styles/media";

import MyDetailedPositionCard from "./my-detailed-position-card/MyDetailedPositionCard";
import MyLiquidityContent from "./my-liquidity-content/MyLiquidityContent";
import MyLiquidityHeader from "./my-liquidity-header/MyLiquidityHeader";

import { MyLiquidityWrapper, MyLiquidityWrapperAnchor, PoolDivider } from "./MyLiquidity.styles";
import { HorizontalScrollWrapper } from "@components/common/scroll-wrapper";

interface MyLiquidityProps {
  address: string | null;
  isOwnerAddress: boolean;
  addressName: string;
  isOtherPosition: boolean;
  openedPosition: PoolPositionModel[];
  closedPosition: PoolPositionModel[];
  breakpoint: DEVICE_TYPE;
  connected: boolean;
  isSwitchNetwork: boolean;
  handleClickAddPosition: () => void;
  handleClickRemovePosition: () => void;
  divRef: React.RefObject<HTMLDivElement>;
  onScroll: () => void;
  currentIndex: number;
  claimAll: () => void;
  claim: (position: PoolPositionModel) => void;
  isStakable: boolean;
  isShowRemovePositionButton: boolean;
  loading: boolean;
  loadingTransactionClaim: boolean;
  isShowClosePosition: boolean;
  handleSetIsClosePosition: () => void;
  isHiddenAddPosition: boolean;
  showClosePositionButton: boolean;
  tokenPrices: Record<string, TokenPriceModel>;
  showViewMorePositions: boolean;
  handleViewMorePositions: () => void;
}

const MyLiquidity: React.FC<MyLiquidityProps> = ({
  isOtherPosition,
  address,
  isOwnerAddress,
  addressName,
  openedPosition,
  breakpoint,
  connected,
  isSwitchNetwork,
  handleClickAddPosition,
  handleClickRemovePosition,
  divRef,
  onScroll,
  currentIndex,
  claimAll,
  claim,
  isStakable,
  isShowRemovePositionButton,
  loading,
  loadingTransactionClaim,
  isShowClosePosition,
  handleSetIsClosePosition,
  isHiddenAddPosition,
  showClosePositionButton,
  tokenPrices,
  closedPosition,
  showViewMorePositions,
  handleViewMorePositions,
}) => {
  const showedPositions = useMemo(() => {
    if (!isShowClosePosition) {
      return openedPosition;
    }

    return [...openedPosition, ...closedPosition];
  }, [closedPosition, isShowClosePosition, openedPosition]);

  return (
    <MyLiquidityWrapper>
      <MyLiquidityWrapperAnchor id={"liquidity-wrapper"} />
      <div className="liquidity-wrap">
        <MyLiquidityHeader
          isOtherPosition={isOtherPosition}
          connectedWallet={connected}
          isSwitchNetwork={isSwitchNetwork}
          address={address}
          addressName={addressName}
          positionLength={showedPositions.length}
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
          positions={openedPosition}
          breakpoint={breakpoint}
          isDisabledButton={isSwitchNetwork || !connected}
          claimAll={claimAll}
          loadingTransactionClaim={loadingTransactionClaim}
          isOtherPosition={isHiddenAddPosition}
          isLoadingPositionsById={loading}
          tokenPrices={tokenPrices}
          isSwitchNetwork={isSwitchNetwork}
        />
      </div>
      {!isSwitchNetwork && openedPosition.length > 0 && <PoolDivider />}
      {((connected && !isSwitchNetwork) || isOtherPosition) &&
        (breakpoint !== DEVICE_TYPE.MOBILE ? (
          <>
            {showedPositions.map((position: PoolPositionModel, index: number) => (
              <MyDetailedPositionCard
                key={index.toString() + position.id}
                position={position}
                isStakable={isStakable}
                breakpoint={breakpoint}
                loading={loading}
                address={address || ""}
                isHiddenAddPosition={isHiddenAddPosition}
                connected={connected}
                tokenPrices={tokenPrices}
                isOwnerAddress={isOwnerAddress}
                claim={claim}
              />
            ))}
          </>
        ) : (
          <>
            <HorizontalScrollWrapper loading={loading} onScroll={onScroll} ref={divRef}>
              <div className="slider-wrap clearfix">
                <div className={"box-slider full-width"}>
                  {showedPositions.map((position: PoolPositionModel, index: number) => (
                    <MyDetailedPositionCard
                      key={index.toString() + position.id}
                      position={position}
                      isStakable={isStakable}
                      breakpoint={breakpoint}
                      loading={loading}
                      address={address || ""}
                      isHiddenAddPosition={isHiddenAddPosition}
                      connected={connected}
                      tokenPrices={tokenPrices}
                      isOwnerAddress={isOwnerAddress}
                      claim={claim}
                    />
                  ))}
                </div>
              </div>
            </HorizontalScrollWrapper>
            {showedPositions.length > 1 && (
              <div className="box-indicator">
                <span className="current-page">{currentIndex}</span>
                <span>/</span>
                <span>{showedPositions.length}</span>
              </div>
            )}
          </>
        ))}
      {showViewMorePositions && <LoadMoreButton show={true} onClick={handleViewMorePositions} />}
    </MyLiquidityWrapper>
  );
};

export default MyLiquidity;
