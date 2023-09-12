import { generateBarAreaDatas } from "@common/utils/test-util";
import Badge, { BADGE_TYPE } from "@components/common/badge/Badge";
import BarAreaGraph from "@components/common/bar-area-graph/BarAreaGraph";
import DoubleLogo from "@components/common/double-logo/DoubleLogo";
import IconSwap from "@components/common/icons/IconSwap";
import {
  type PoolListProps,
  POOL_CONTENT_TITLE,
} from "@containers/incentivized-pool-card-list-container/IncentivizedPoolCardListContainer";
import { PoolCardWrapper } from "./IncentivizedPoolCard.styles";

export interface IncentivizedPoolCardProps {
  item: PoolListProps;
  routeItem: (id: number) => void;
}

const IncentivizedPoolCard: React.FC<IncentivizedPoolCardProps> = ({
  item,
  routeItem,
}) => {
  return (
    <PoolCardWrapper
      onClick={() => routeItem(Math.floor(Math.random() * 100 + 1))}
    >
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
        <div className="pool-content">
          <div className="pool-rate-wrapper">
            <span>{`1 ${item.name[0]}`}</span>
            <IconSwap />
            <span>{`${item.currentTick} ${item.name[1]}`}</span>
          </div>
          <BarAreaGraph
            width={258}
            height={60}
            currentTick={20}
            datas={generateBarAreaDatas()}
          />
        </div>
      </div>
    </PoolCardWrapper>
  );
};

export default IncentivizedPoolCard;
