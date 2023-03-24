import Badge from "@components/common/badge/Badge";
import { BadgeHierarchy } from "@components/common/badge/Badge.styles";
import DoubleLogo from "@components/common/double-logo/DoubleLogo";
import {
  type PoolListProps,
  POOL_CONTENT_TITLE,
} from "@containers/incentivized-pool-card-list-container/IncentivizedPoolCardListContainer";
import { wrapper } from "./IncentivizedPoolCard.styles";

interface IncentivizedPoolCardProps {
  item: PoolListProps;
}

const IncentivizedPoolCard: React.FC<IncentivizedPoolCardProps> = ({
  item,
}) => {
  return (
    <div css={wrapper}>
      <div className="pool-info">
        <div className="token-pair">
          <DoubleLogo left={item.logo[0]} right={item.logo[1]} />
          <span>{`${item.name[0]}/${item.name[1]}`}</span>
        </div>
        <Badge
          text={item.fee}
          style={{
            hierarchy: BadgeHierarchy.Default,
          }}
        />
      </div>
      <div className="pool-content">
        <div className="content-section">
          <div className="content-item">
            <span className="label-text">{POOL_CONTENT_TITLE.LIQUIDITY}</span>
            <span className="value-text">{item.liquidity}</span>
          </div>
          <div className="content-item">
            <span className="label-text">{POOL_CONTENT_TITLE.APR}</span>
            <span className="value-text">{item.apr}</span>
          </div>
        </div>
        <div className="content-section">
          <div className="content-item">
            <span className="label-text">{POOL_CONTENT_TITLE.VOLUME}</span>
            <span className="value-text">{item.volume24h}</span>
          </div>
          <div className="content-item">
            <span className="label-text">{POOL_CONTENT_TITLE.FEE}</span>
            <span className="value-text">{item.fees24h}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncentivizedPoolCard;
