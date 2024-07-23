import { MATH_NEGATIVE_TYPE } from "@constants/option.constant";
import { cx } from "@emotion/css";
import { wrapper } from "./PriceInformationList.styles";
import { pulseSkeletonStyle } from "@constants/skeleton.constant";
import { useTranslation } from "react-i18next";

interface PriceInformationListProps {
  list: any;
  loading: boolean;
}

const PriceInformationList: React.FC<PriceInformationListProps> = ({
  list,
  loading,
}) => {
  const { t } = useTranslation();

  const TITLE_LIST = [
    t("TokenDetails:info.info.priceChange", {
      period: "1h",
    }),
    t("TokenDetails:info.info.priceChange", {
      period: "24h",
    }),
    t("TokenDetails:info.info.priceChange", {
      period: "7d",
    }),
    t("TokenDetails:info.info.priceChange", {
      period: "30d",
    }),
  ];
  return (
    <div css={wrapper}>
      {Object.values(list).map((item: any, idx: number) => (
        <div key={idx} className="information-wrap">
          <div className="title">{TITLE_LIST[idx]}</div>
          {!loading && (
            <span
              className={cx("price-info-value", {
                negative: item.status === MATH_NEGATIVE_TYPE.NEGATIVE,
                none: item.status === MATH_NEGATIVE_TYPE.NONE,
              })}
            >
              {item.value}
            </span>
          )}
          {loading && (
            <span
              className="loading-value"
              css={pulseSkeletonStyle({
                h: "20px",
                w: "100px",
                tabletWidth: "50",
                smallTableWidth: "100",
              })}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default PriceInformationList;
