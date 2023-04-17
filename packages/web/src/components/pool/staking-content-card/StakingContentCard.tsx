import React from "react";
import Tooltip from "@components/common/tooltip/Tooltip";
import { wrapper } from "./StakingContentCard.styles";

interface StakingContentCardProps {
  item: any;
}

const StakingContentCard: React.FC<StakingContentCardProps> = ({ item }) => {
  return (
    <div css={wrapper(item.active)}>
      <h5>{item.title}</h5>
      <span className="total-value">{item.total}</span>
      <div className="staking-info-wrap">
        <section>
          <h5>Staking</h5>
          <span className="default-value">{item.staking}</span>
        </section>
        <section>
          <h5>Being unstaked</h5>
          {item.active ? (
            <Tooltip placement="top" FloatingContent={<div>TODO...</div>}>
              <span className="default-value has-tooltip">
                {item.beingUnstaked}
              </span>
            </Tooltip>
          ) : (
            <span className="default-value">{item.beingUnstaked}</span>
          )}
        </section>
      </div>
      <div className="staking-apr-wrap">
        <span className="apr-value">{`${item.apr} APR`}</span>
        <div className="logo-images-wrap">
          {item.tokenLogo.map((img: string, idx: number) => (
            <img src={img} alt="token logo image" key={idx} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default StakingContentCard;
