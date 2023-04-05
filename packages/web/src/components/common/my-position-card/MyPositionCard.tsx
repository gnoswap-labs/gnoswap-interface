import { RANGE_STATUS_OPTION, STAKED_OPTION } from "@constants/option.constant";
import { POSITION_CONTENT_LABEL } from "@containers/my-position-card-list-container/MyPositionCardListContainer";
import Badge, { BADGE_TYPE } from "@components/common/badge/Badge";
import DoubleLogo from "@components/common/double-logo/DoubleLogo";
import IconStaking from "@components/common/icons/IconStaking";
import RangeBadge from "@components/common/range-badge/RangeBadge";
import { wrapper } from "./MyPositionCard.styles";

interface MyPositionCardProps {
  item: any;
}

const MyPositionCard: React.FC<MyPositionCardProps> = ({ item }) => {
  const { tokenPair } = item;
  return (
    <div css={wrapper(item.stakeType)}>
      <div className="token-pair">
        <DoubleLogo
          left={tokenPair.token0.tokenLogo}
          right={tokenPair.token1.tokenLogo}
        />
        <span>{`${tokenPair.token0.symbol}/${tokenPair.token1.symbol}`}</span>
      </div>
      <div className="badge-info">
        {item.stakeType === STAKED_OPTION.STAKED && (
          <Badge
            type={BADGE_TYPE.PRIMARY}
            leftIcon={<IconStaking className="staking-icon" />}
            text="Staked"
          />
        )}
        <Badge type={BADGE_TYPE.DARK_DEFAULT} text={`${item.feeRate} Fee`} />
      </div>
      <div className="pool-price-info">
        <div className="content-item">
          <span className="label-text">{POSITION_CONTENT_LABEL.VALUE}</span>
          <span>{item.value}</span>
        </div>
        <div className="content-item">
          <span className="label-text">{POSITION_CONTENT_LABEL.APR}</span>
          <span>
            {item.stakeType === "STAKED"
              ? `${POSITION_CONTENT_LABEL.STAR_TAG}${item.apr}`
              : item.apr}
          </span>
        </div>
      </div>

      <div className="pool-price-graph">
        <div className="price-range-info">
          <div className="current-price">
            <span className="label-text">
              {POSITION_CONTENT_LABEL.CURRENT_PRICE}
            </span>
            <span>{item.currentPriceAmount}</span>
          </div>
          <RangeBadge
            status={
              item.inRange ? RANGE_STATUS_OPTION.IN : RANGE_STATUS_OPTION.OUT
            }
          />
        </div>
        <div className="dummy-chart" />
        <div className="min-max-price">
          <div className="price-section">
            <span className="label-text">
              {POSITION_CONTENT_LABEL.MIN_PRICE}
            </span>
            <span>{item.minPriceAmount}</span>
          </div>
          <div className="price-section">
            <span className="label-text">
              {POSITION_CONTENT_LABEL.MAX_PRICE}
            </span>
            <span>{item.maxPriceAmount}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyPositionCard;
