import { cx } from "@emotion/css";
import { useTranslation } from "react-i18next";

import { MATH_NEGATIVE_TYPE } from "@constants/option.constant";
import { pulseSkeletonStyle } from "@constants/skeleton.constant";

import { wrapper } from "./PriceInformationList.styles";

export const priceInfomationInit = {
  priceChange1h: {
    status: MATH_NEGATIVE_TYPE.NEGATIVE,
    value: "-54.00%",
  },
  priceChange24h: {
    status: MATH_NEGATIVE_TYPE.POSITIVE,
    value: "+54.00%",
  },
  priceChange7d: {
    status: MATH_NEGATIVE_TYPE.NEGATIVE,
    value: "-54.00%",
  },
  priceChange30d: {
    status: MATH_NEGATIVE_TYPE.POSITIVE,
    value: "+54.00%",
  },
};

interface PriceInformationListProps {
  list: {
    [key: string]: {
      status: "NEGATIVE" | "POSITIVE" | "NONE";
      value: string;
    };
  };
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
      {Object.values(list).map(
        (
          item: {
            status: "NEGATIVE" | "POSITIVE" | "NONE";
            value: string;
          },
          idx: number,
        ) => (
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
        ),
      )}
    </div>
  );
};

export default PriceInformationList;
