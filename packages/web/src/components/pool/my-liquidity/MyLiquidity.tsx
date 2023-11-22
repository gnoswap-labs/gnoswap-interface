import React from "react";
import MyLiquidityContent from "@components/pool/my-liquidity-content/MyLiquidityContent";
import MyLiquidityHeader from "@components/pool/my-liquidity-header/MyLiquidityHeader";
import { PoolDivider, MyLiquidityWrapper } from "./MyLiquidity.styles";
import { DEVICE_TYPE } from "@styles/media";
import MyPositionCard from "../my-position-card/MyPositionCard";

interface MyLiquidityProps {
  info: any;
  breakpoint: DEVICE_TYPE;
  connected: boolean;
  isSwitchNetwork: boolean;
  handleClickAddPosition: () => void;
  handleClickRemovePosition: () => void;
  divRef: React.RefObject<HTMLDivElement>;
  onScroll: () => void;
  currentIndex: number;
}

const MyLiquidity: React.FC<MyLiquidityProps> = ({ 
  info,
  breakpoint,
  connected,
  isSwitchNetwork,
  handleClickAddPosition,
  handleClickRemovePosition,
  divRef,
  onScroll,
  currentIndex,
}) => {
  return (
    <MyLiquidityWrapper>
      <div className="liquidity-wrap">
        <MyLiquidityHeader
          info={info.poolInfo}
          connected={connected}
          isSwitchNetwork={isSwitchNetwork}
          handleClickAddPosition={handleClickAddPosition}
          handleClickRemovePosition={handleClickRemovePosition}  
        />
        <MyLiquidityContent content={info} breakpoint={breakpoint} isDisabledButton={isSwitchNetwork || !connected} />
      </div>
      <PoolDivider />
      {breakpoint !== DEVICE_TYPE.MOBILE ? (
        info.positionList.map((item: any, idx: number) => (
          <MyPositionCard content={item} key={idx} breakpoint={breakpoint} />
        ))
      ) : (
        <>
          <div className="slider-wrap" ref={divRef}  onScroll={onScroll}>
            <div className="box-slider">
              {info.positionList.map((item: any, idx: number) => (
                <MyPositionCard
                  content={item}
                  key={idx}
                  breakpoint={breakpoint}
                />
              ))}
            </div>
          </div>
          <div className="box-indicator">
            <span className="current-page">{currentIndex}</span>
            <span>/</span>
            <span>{info.positionList.length}</span>
          </div>
        </>
      )}
    </MyLiquidityWrapper>
  );
};

export default MyLiquidity;
