import React from "react";
import MyLiquidityContent from "@components/pool/my-liquidity-content/MyLiquidityContent";
import MyLiquidityHeader from "@components/pool/my-liquidity-header/MyLiquidityHeader";
import { PoolDivider, MyLiquidityWrapper } from "./MyLiquidity.styles";
import { DEVICE_TYPE } from "@styles/media";
import MyPositionCard from "../my-position-card/MyPositionCard";
import { PoolPositionModel } from "@models/position/pool-position-model";

interface MyLiquidityProps {
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
}

const MyLiquidity: React.FC<MyLiquidityProps> = ({
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
}) => {
  return (
    <MyLiquidityWrapper>
      <div className="liquidity-wrap">
        <MyLiquidityHeader
          availableRemovePosition={availableRemovePosition}
          handleClickAddPosition={handleClickAddPosition}
          handleClickRemovePosition={handleClickRemovePosition}
        />
        <MyLiquidityContent
          connected={connected}
          positions={positions}
          breakpoint={breakpoint}
          isDisabledButton={isSwitchNetwork || !connected}
          claimAll={claimAll}
          loading={loading}
        />
      </div>
      {positions.length > 0 && <PoolDivider />}
      {breakpoint !== DEVICE_TYPE.MOBILE ? (
        positions.map((position: PoolPositionModel, index: number) => (
          <MyPositionCard position={position} key={index} breakpoint={breakpoint} loading={loading}/>
        ))
      ) : (
        <>
          <div className="slider-wrap" ref={divRef} onScroll={onScroll}>
            <div className={`box-slider ${positions.length === 1 ? "full-width" : positions.length === 2 ? "w-50" : ""}`}>
              {positions.map((position: PoolPositionModel, index: number) => (
                <MyPositionCard
                  position={position}
                  key={index}
                  breakpoint={breakpoint}
                  loading={loading}
                />
              ))}
            </div>
          </div>
          <div className="box-indicator">
            <span className="current-page">{currentIndex}</span>
            <span>/</span>
            <span>{positions.length}</span>
          </div>
        </>
      )}
    </MyLiquidityWrapper>
  );
};

export default MyLiquidity;
