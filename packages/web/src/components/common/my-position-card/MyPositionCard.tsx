import { RANGE_STATUS_OPTION, STAKED_OPTION } from "@constants/option.constant";
import { POSITION_CONTENT_LABEL } from "@containers/my-position-card-list-container/MyPositionCardListContainer";
import Badge, { BADGE_TYPE } from "@components/common/badge/Badge";
import DoubleLogo from "@components/common/double-logo/DoubleLogo";
import IconStaking from "@components/common/icons/IconStaking";
import RangeBadge from "@components/common/range-badge/RangeBadge";
import { MyPositionCardWrapper } from "./MyPositionCard.styles";

interface MyPositionCardProps {
  item: any;
  routeItem: (id: number) => void;
}

const MyPositionCard: React.FC<MyPositionCardProps> = ({ item, routeItem }) => {
  const { tokenPair } = item;
  return (
    <MyPositionCardWrapper
      stakeType={item.stakeType}
      onClick={() => routeItem(Math.floor(Math.random() * 100 + 1))}
    >
      <div className="title-wrapper">
        <div className="box-header">
          <DoubleLogo
            left={tokenPair.token0.tokenLogo}
            right={tokenPair.token1.tokenLogo}
          />
          <span>{`${tokenPair.token0.symbol}/${tokenPair.token1.symbol}`}</span>
        </div>
        <div className="badge-group">
          {item.stakeType === STAKED_OPTION.STAKED && (
            <Badge
              type={BADGE_TYPE.PRIMARY}
              leftIcon={<IconStaking className="staking-icon" />}
              text="Staked"
            />
          )}
          <Badge type={BADGE_TYPE.DARK_DEFAULT} text={`${item.feeRate} Fee`} />
        </div>
      </div>
      <div className="list-wrapper">
        <div className="list-header">
          <span className="label-text">{POSITION_CONTENT_LABEL.VALUE}</span>
          <span className="label-text">{POSITION_CONTENT_LABEL.APR}</span>
        </div>
        <div className="list-content">
          <span>{item.value}</span>
          {item.stakeType === "STAKED"
            ? `${POSITION_CONTENT_LABEL.STAR_TAG}${item.apr}`
            : item.apr}
        </div>
      </div>
      <div className="pool-price-graph">
        <div className="price-range-info">
          <div className="current-price">
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
            <span className="label-text">{item.minPriceAmount}</span>
          </div>
          <div className="price-section">
            <span className="label-text">
              {POSITION_CONTENT_LABEL.MAX_PRICE}
            </span>
            <span className="label-text">{item.maxPriceAmount}</span>
          </div>
        </div>
      </div>
    </MyPositionCardWrapper>
  );
};

export default MyPositionCard;
