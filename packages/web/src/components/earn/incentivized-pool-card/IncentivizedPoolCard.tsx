import Badge, { BADGE_TYPE } from "@components/common/badge/Badge";
import DoubleLogo from "@components/common/double-logo/DoubleLogo";
import {
  type PoolListProps,
  POOL_CONTENT_TITLE,
} from "@containers/incentivized-pool-card-list-container/IncentivizedPoolCardListContainer";
import { PoolCardWrapper } from "./IncentivizedPoolCard.styles";

interface IncentivizedPoolCardProps {
  item: PoolListProps;
}

const IncentivizedPoolCard: React.FC<IncentivizedPoolCardProps> = ({
  item,
}) => {
  return (
    <PoolCardWrapper>
      <div className="pool-container">
        <div className="title-container">
          <div className="box-header">
            <DoubleLogo left={item.logo[0]} right={item.logo[1]} />
            <span>{`${item.name[0]}/${item.name[1]}`}</span>
          </div>
          <div className="box-group">
            <Badge type={BADGE_TYPE.DARK_DEFAULT} text={item.fee} />
          </div>
        </div>
        <div className="list-wrapper">
          <div className="list-header">
            <span className="label-text">{POOL_CONTENT_TITLE.LIQUIDITY}</span>
            <span className="label-text">{POOL_CONTENT_TITLE.APR}</span>
          </div>
          <div className="list-content">
            <span className="value-text">{item.liquidity}</span>
            <span className="value-text">{item.apr}</span>
          </div>
        </div>
      </div>
      <div className="volume-container">
        <div className="volume-header">
          <div className="volume-title">
            <span className="label-text">{POOL_CONTENT_TITLE.VOLUME}</span>
            <span className="label-text">{POOL_CONTENT_TITLE.FEE}</span>
          </div>
          <div className="volume-content">
            <span className="value-text">{item.volume24h}</span>
            <span className="value-text">{item.fees24h}</span>
          </div>
        </div>
        <div className="pool-content"></div>
      </div>
    </PoolCardWrapper>
  );
};

export default IncentivizedPoolCard;
