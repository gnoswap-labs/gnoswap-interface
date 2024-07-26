import React from "react";
import { MATH_NEGATIVE_TYPE } from "@constants/option.constant";
import { cx } from "@emotion/css";
import { wrapper } from "./PricePerformanceList.styles";
import { pulseSkeletonStyle } from "@constants/skeleton.constant";
import { useTranslation } from "react-i18next";

interface PricePerformanceListProps {
  list: any[];
  loading: boolean;
}

const TITLE_LIST = [
  "TokenDetails:info.performance.col.header.period",
  "TokenDetails:info.performance.col.header.amount",
  "TokenDetails:info.performance.col.header.change",
];

const PricePerformanceList: React.FC<PricePerformanceListProps> = ({
  list,
  loading,
}) => {
  const { t } = useTranslation();

  return (
    <div css={wrapper}>
      <div className="title-wrap">
        {TITLE_LIST.map((title, idx) => (
          <span className={cx("title", { left: idx === 0 })} key={idx}>
            {t(title)}
          </span>
        ))}
      </div>
      <div className="performance-wrap">
        {list.map((item, idx) => (
          <div className="performance-list" key={idx}>
            <span className="createdAt">{item.createdAt}</span>
            {!loading && (
              <span
                className={cx({
                  negative: item.amount.status === MATH_NEGATIVE_TYPE.NEGATIVE,
                  none: item.amount.status === MATH_NEGATIVE_TYPE.NONE,
                })}
              >
                {item.amount.value}
              </span>
            )}
            {loading && (
              <div className="loading-wrapper">
                <span
                  css={pulseSkeletonStyle({
                    h: 22,
                    w: "100px!important",
                    mobileWidth: "50px!important",
                  })}
                />
              </div>
            )}
            {loading && (
              <div className="loading-wrapper">
                <span
                  css={pulseSkeletonStyle({
                    h: 22,
                    w: "100px!important",
                    mobileWidth: "50px!important",
                  })}
                />
              </div>
            )}
            {!loading && (
              <span
                className={cx({
                  negative: item.change.status === MATH_NEGATIVE_TYPE.NEGATIVE,
                  none: item.change.status === MATH_NEGATIVE_TYPE.NONE,
                })}
              >
                {item.change.value}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PricePerformanceList;
