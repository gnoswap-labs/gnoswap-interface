import React from "react";
import { TOKEN_PRICE_GRADE_TYPE } from "@models/token/token-price-grade";

interface UseTokenPriceProps {
  priceGradeType: TOKEN_PRICE_GRADE_TYPE;
}

export const useTokenPriceInfo = ({ priceGradeType }: UseTokenPriceProps) => {
  const priceStyle = React.useMemo(() => {
    if (priceGradeType === TOKEN_PRICE_GRADE_TYPE.INFORMATIONAL) {
      return {
        className: "informational-price",
      };
    }
    return {};
  }, [priceGradeType]);

  const shouldShowPriceWarning = React.useMemo(() => {
    return priceGradeType === TOKEN_PRICE_GRADE_TYPE.INFORMATIONAL;
  }, [priceGradeType]);

  return {
    priceStyle,
    shouldShowPriceWarning,
  };
};
