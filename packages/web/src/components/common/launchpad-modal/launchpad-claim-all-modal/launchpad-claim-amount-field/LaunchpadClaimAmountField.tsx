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
    if (type === "DEPOSIT") {
      return DEFAULT_DEPOSIT_TOKEN?.wrappedPath && !!amount
        ? formatPrice(
            BigNumber(+amount)
              .multipliedBy(
                Number(
                  tokenPrices?.[DEFAULT_DEPOSIT_TOKEN?.wrappedPath]?.usd ?? "0",
                ),
              )
              .toString(),
            {
              usd: true,
              isKMB: false,
            },
          )
        : "-";
    }

    return rewardInfo?.rewardTokenPath && !!amount
      ? formatPrice(
          BigNumber(+amount)
            .multipliedBy(
              Number(tokenPrices?.[rewardInfo?.rewardTokenPath]?.usd ?? "0"),
            )
            .toString(),
          {
            usd: true,
            isKMB: false,
          },
        )
      : "-";
  }, [type, amount, tokenPrices, rewardInfo]);

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
          {toNumberFormat(amount, 2)} {DEFAULT_DEPOSIT_TOKEN?.symbol}
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
          {toNumberFormat(amount, 2)} {rewardInfo?.rewardTokenSymbol}
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
