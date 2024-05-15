import React from "react";
import MyLiquidityContent from "@components/pool/my-liquidity-content/MyLiquidityContent";
import MyLiquidityHeader from "@components/pool/my-liquidity-header/MyLiquidityHeader";
import { PoolDivider, MyLiquidityWrapper, MyLiquidityWrapperAnchor } from "./MyLiquidity.styles";
import { DEVICE_TYPE } from "@styles/media";
import MyPositionCard from "../my-position-card/MyPositionCard";
import { PoolPositionModel } from "@models/position/pool-position-model";

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
  availableRemovePosition: boolean;
  loading: boolean;
  loadngTransactionClaim: boolean;
  isShowClosePosition: boolean;
  handleSetIsClosePosition: () => void;
  isHiddenAddPosition: boolean;
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
  availableRemovePosition,
  loading,
  loadngTransactionClaim,
  isShowClosePosition,
  handleSetIsClosePosition,
  isHiddenAddPosition,
}) => {
  return (
    <>
      <MyLiquidityWrapperAnchor id="liquidity-wrapper" />

      <MyLiquidityWrapper>
        <div className="liquidity-wrap">
          <MyLiquidityHeader
            isOtherPosition={isOtherPosition}
            connectedWallet={connected}
            address={address}
            addressName={addressName}
            positionLength={positions.length}
            availableRemovePosition={availableRemovePosition}
            handleClickAddPosition={handleClickAddPosition}
            handleClickRemovePosition={handleClickRemovePosition}
            isShowClosePosition={isShowClosePosition}
            handleSetIsClosePosition={handleSetIsClosePosition}
            isHiddenAddPosition={isHiddenAddPosition}
          />
          <MyLiquidityContent
            connected={connected}
            positions={positions}
            breakpoint={breakpoint}
            isDisabledButton={isSwitchNetwork || !connected}
            claimAll={claimAll}
            loading={loading}
            loadngTransactionClaim={loadngTransactionClaim}
            isOtherPosition={isHiddenAddPosition}
          />
        </div>
        {positions.length > 0 && <PoolDivider />}
        {breakpoint !== DEVICE_TYPE.MOBILE ? (
          positions.map((position: PoolPositionModel, index: number) => (
            <MyPositionCard
              position={position}
              key={index}
              breakpoint={breakpoint}
              loading={loading}
              address={address || ""}
              isHiddenAddPosition={isHiddenAddPosition}
              connected={connected}
            />
          ))
        ) : (
          <>
            <div className="slider-wrap" ref={divRef} onScroll={onScroll}>
              <div className={"box-slider full-width"}>
                {positions.map((position: PoolPositionModel, index: number) => (
                  <MyPositionCard
                    position={position}
                    key={index}
                    breakpoint={breakpoint}
                    loading={loading}
                    address={address || ""}
                    isHiddenAddPosition={isHiddenAddPosition}
                    connected={connected}
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
