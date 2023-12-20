import { MATH_NEGATIVE_TYPE } from "@constants/option.constant";
import { cx } from "@emotion/css";
import { wrapper } from "./PriceInformationList.styles";
import { pulseSkeletonStyle } from "@constants/skeleton.constant";

interface PriceInformationListProps {
  list: any;
  loading: boolean;
}

const TITLE_LIST = [
  <div key={1}>
    Price Change <br />
    (1h)
  </div>,
  <div key={2}>
    Price Change <br />
    (24h)
  </div>,
  <div key={3}>
    Price Change <br />
    (7d)
  </div>,
  <div key={4}>
    Price Change <br />
    (30d)
  </div>,
];

const PriceInformationList: React.FC<PriceInformationListProps> = ({
  list,
  loading,
}) => {
  return (
    <div css={wrapper}>
      {Object.values(list).map((item: any, idx: number) => (
        <div key={idx} className="information-wrap">
          <div className="title">{TITLE_LIST[idx]}</div>
          {!loading && <span
            className={cx("price-info-value", {
              negative: item.status === MATH_NEGATIVE_TYPE.NEGATIVE,
              none: item.status === MATH_NEGATIVE_TYPE.NONE,
            })}
          >
            {item.value}
          </span>}
          {loading && <span
            className="loading-value"
            css={pulseSkeletonStyle({ h: 22, w : "100%"})}
          />}
        </div>
      ))}
    </div>
  );
};

export default PriceInformationList;
