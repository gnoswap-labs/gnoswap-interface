import React from "react";
import Image from "next/image";
import BigNumber from "bignumber.js";

import { GNS_TOKEN } from "@common/values/token-constant";
import { useTokenData } from "@hooks/token/use-token-data";
import { ProjectRewardInfoModel } from "@views/launchpad/launchpad-detail/LaunchpadDetail";

import { ClaimAllFieldWrapper } from "./LaunchpadClaimAmountField.styled";
import MissingLogo from "@components/common/missing-logo/MissingLogo";
import { toNumberFormat } from "@utils/number-utils";
import { formatPrice } from "@utils/new-number-utils";

interface LaunchpadClaimAmountFieldProps {
  amount: number;
  rewardInfo: ProjectRewardInfoModel;
  type: "DEPOSIT" | "CLAIMABLE";
}

const DEFAULT_DEPOSIT_TOKEN = GNS_TOKEN;

const LaunchpadClaimAmountField = ({
  amount,
  rewardInfo,
  type,
}: LaunchpadClaimAmountFieldProps) => {
  const { tokenPrices } = useTokenData();

  const estimatePrice = React.useMemo(() => {
    const calculatePrice = (
      tokenPath: string | undefined,
      amountValue: number,
    ) => {
      if (!tokenPath || !amountValue) return "-";

      const price = formatPrice(
        BigNumber(amountValue)
          .multipliedBy(Number(tokenPrices?.[tokenPath]?.usd ?? "0"))
          .toString(),
        {
          usd: true,
          isKMB: false,
        },
      );

      return price === "$0" ? "-" : price;
    };

    if (type === "DEPOSIT") {
      return calculatePrice(DEFAULT_DEPOSIT_TOKEN?.wrappedPath, amount);
    }

    return calculatePrice(rewardInfo?.rewardTokenPath, amount);
  }, [type, amount, tokenPrices, rewardInfo, DEFAULT_DEPOSIT_TOKEN]);

  if (type === "DEPOSIT") {
    return (
      <ClaimAllFieldWrapper>
        <div className="value-token">
          <Image
            width={24}
            height={24}
            src={DEFAULT_DEPOSIT_TOKEN?.logoURI}
            alt={`${DEFAULT_DEPOSIT_TOKEN?.symbol} token symbol image`}
          />
          {toNumberFormat(amount, 6)} {DEFAULT_DEPOSIT_TOKEN?.symbol}
        </div>
        <div className="value-price">{estimatePrice}</div>
      </ClaimAllFieldWrapper>
    );
  }

  if (type === "CLAIMABLE") {
    return (
      <ClaimAllFieldWrapper>
        <div className="value-token">
          <MissingLogo
            symbol={rewardInfo.rewardTokenSymbol}
            url={rewardInfo?.rewardTokenLogoUrl}
            width={24}
          />
          {toNumberFormat(amount, 6)} {rewardInfo?.rewardTokenSymbol}
        </div>
        <div className="value-price">{estimatePrice}</div>
      </ClaimAllFieldWrapper>
    );
  }

  return (
    <ClaimAllFieldWrapper>
      <div className="value-token">-</div>
    </ClaimAllFieldWrapper>
  );
};

export default LaunchpadClaimAmountField;
