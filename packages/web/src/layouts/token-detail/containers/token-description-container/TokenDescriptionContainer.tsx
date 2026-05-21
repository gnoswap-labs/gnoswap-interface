import React, { useEffect, useState } from "react";

import useCustomRouter from "@hooks/common/use-custom-router";
import { useGnoscanUrl } from "@hooks/common/use-gnoscan-url";
import { useLoading } from "@hooks/common/use-loading";
import { useGetToken } from "@query/token";
import { TokenModel } from "@models/token/token-model";
import { GNS_TOKEN } from "@common/values/token-constant";
import { formatTokenModelPath } from "@utils/token-utils";

import TokenDescription from "../../components/token-description/TokenDescription";

export interface DescriptionInfo {
  token: TokenModel;
  links: {
    Website: string;
    Gnoscan: string;
  };
}

export const descriptionInit: DescriptionInfo = {
  token: GNS_TOKEN,
  links: {
    Website: "https://gnoswap.io",
    Gnoscan: "https://gnoscan.io/tokens/r/demo/wugnot",
  },
};

const TokenDescriptionContainer: React.FC = () => {
  const { getGnoscanUrl, getTokenUrl } = useGnoscanUrl();
  const [descriptionInfo, setDescriptionInfo] = useState<DescriptionInfo>(descriptionInit);
  const [copied, setCopied] = useState(false);
  const router = useCustomRouter();
  const path = router.getTokenPath();
  const { data: tokenB, isLoading } = useGetToken(path, {
    enabled: !!path,
  });

  const { isLoading: isLoadingCommon } = useLoading();

  const copyClick = async () => {
    try {
      await navigator.clipboard.writeText(descriptionInfo.token.path);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      throw new Error("Copy Error!");
    }
  };

  const displayTokenPath = React.useMemo(() => {
    return formatTokenModelPath(descriptionInfo.token);
  }, [descriptionInfo.token]);

  useEffect(() => {
    if (tokenB) {
      setDescriptionInfo(() => ({
        token: {
          ...tokenB,
        },
        links: {
          Website: tokenB.websiteURL || "",
          Gnoscan: tokenB.path === "ugnot" ? getGnoscanUrl() : getTokenUrl(tokenB.tokenId),
        },
      }));
    }
  }, [getGnoscanUrl, getTokenUrl, router.query, tokenB]);

  return (
    <TokenDescription
      tokenName={descriptionInfo.token.name}
      tokenSymbol={descriptionInfo.token.displaySymbol}
      content={descriptionInfo.token.description || ""}
      links={descriptionInfo.links}
      path={displayTokenPath}
      loading={isLoading || isLoadingCommon}
      copyClick={copyClick}
      copied={copied}
    />
  );
};

export default TokenDescriptionContainer;
