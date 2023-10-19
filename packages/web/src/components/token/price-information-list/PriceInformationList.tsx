import { MATH_NEGATIVE_TYPE } from "@constants/option.constant";
import { cx } from "@emotion/css";
import { wrapper } from "./PriceInformationList.styles";

interface PriceInformationListProps {
  list: any;
}

const TITLE_LIST = [
  "Price Chage(1h)",
  "Price Chage(24h)",
  "Price Chage(7d)",
  "Price Chage(30d)",
];

const PriceInformationList: React.FC<PriceInformationListProps> = ({
  list,
}) => {
  return (
    <div css={wrapper}>
      {Object.values(list).map((item: any, idx: number) => (
        <div key={idx} className="information-wrap">
          <span className="title">{TITLE_LIST[idx]}</span>
          <span
            className={cx("price-info-value", {
              negative: item.status === MATH_NEGATIVE_TYPE.NEGATIVE,
            })}
          >
            {item.value}
          </span>
        </div>
      ))}
    </div>
  );
};

export default PriceInformationList;
