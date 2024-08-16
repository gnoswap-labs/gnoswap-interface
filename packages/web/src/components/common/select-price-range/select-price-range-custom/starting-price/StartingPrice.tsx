import BigNumber from "bignumber.js";
import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import IconInfo from "@components/common/icons/IconInfo";
import Tooltip from "@components/common/tooltip/Tooltip";
import { formatTokenExchangeRate } from "@utils/stake-position-utils";

import { StartingPriceWrapper, TooltipContentWrapper } from "./StartingPrice.styles";

interface StartingPriceProps {
  tokenASymbol: string;
  tokenBSymbol: string;
  isEmptyLiquidity: boolean;
  defaultPrice: number | null;
  startingPriceValue: string;
  setStartingPriceValue: (value: string) => void;
  changeStartingPrice: (price: string) => void;
}

const StartingPrice: React.FC<StartingPriceProps> = ({
  tokenASymbol,
  tokenBSymbol,
  isEmptyLiquidity,
  defaultPrice,
  startingPriceValue,
  setStartingPriceValue,
  changeStartingPrice,
}) => {
  const { t } = useTranslation();

  const [tempPrice, setTempPrice] = useState<string>("");

  const startingPriceDescription = useMemo(() => {
    if (
      !tokenASymbol ||
      !tokenBSymbol ||
      ((startingPriceValue === "" || BigNumber(startingPriceValue).isNaN()) &&
        !defaultPrice)
    ) {
      return "";
    }

    console.log(tokenASymbol, tokenBSymbol);

    let value = "";
    if (
      (startingPriceValue === "" || BigNumber(startingPriceValue).isNaN()) &&
      defaultPrice
    ) {
      value = defaultPrice.toString();
    } else {
      value = startingPriceValue;
    }

    return (
      <>
        1 {tokenASymbol} =&nbsp;
        {formatTokenExchangeRate(value, {
          maxSignificantDigits: 6,
          minLimit: 0.000001,
        })}
        &nbsp; {tokenBSymbol}
      </>
    );
  }, [tokenASymbol, tokenBSymbol, defaultPrice, startingPriceValue]);

  const onChangeStartingPrice = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      const formattedValue = value.replace(/[^0-9.]/, "");
      setStartingPriceValue(formattedValue);
    },
    [],
  );

  const updateStartingPrice = useCallback(() => {
    if (startingPriceValue === "" || !Number(startingPriceValue)) {
      setStartingPriceValue("");
      changeStartingPrice("");
      return;
    }
    setTempPrice(startingPriceValue);
    changeStartingPrice(startingPriceValue);
  }, [startingPriceValue]);

  const formatStartingPrice = useMemo(() => {
    if (tempPrice) {
      return tempPrice;
    }

    return startingPriceValue;
  }, [startingPriceValue, tempPrice]);

  return (
    <StartingPriceWrapper className="starting-price-wrapper">
      <div className="title-wrapper">
        <span className="sub-title">
          {t("AddPosition:createPool.startingPrice")}
        </span>
        <div className="price-info">
          {!startingPriceValue && !isEmptyLiquidity && (
            <Tooltip
              placement="top"
              FloatingContent={
                <TooltipContentWrapper>
                  {t("AddPosition:createPool.tooltip")}
                </TooltipContentWrapper>
              }
            >
              <IconInfo />
            </Tooltip>
          )}
          <span className="description">{startingPriceDescription}</span>
        </div>
      </div>
      <input
        className="starting-price-input"
        value={formatStartingPrice}
        onChange={onChangeStartingPrice}
        onBlur={updateStartingPrice}
        onFocus={() => setTempPrice("")}
        placeholder={t("AddPosition:createPool.placeholder")}
      />
    </StartingPriceWrapper>
  );
};

export default StartingPrice;