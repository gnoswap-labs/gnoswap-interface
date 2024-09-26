import React, { useEffect, useState } from "react";

import useCustomRouter from "@hooks/common/use-custom-router";
import { useGnoscanUrl } from "@hooks/common/use-gnoscan-url";
import { useLoading } from "@hooks/common/use-loading";
import { useGetToken } from "@query/token";

import TokenDescription from "../../components/token-description/TokenDescription";

export interface DescriptionInfo {
  token: {
    name: string;
    symbol: string;
    image: string;
    pkg_path: string;
    decimals: number;
    description: string;
    website_url: string;
  };
  links: {
    Website: string;
    Gnoscan: string;
  };
}

export const descriptionInit: DescriptionInfo = {
  token: {
    pkg_path: "1",
    name: "Bitcoin",
    symbol: "BTC",
    image: "/gns.svg",
    decimals: 1,
    description: "string",
    website_url: "string",
  },
  links: {
    Website: "https://gnoswap.io",
    Gnoscan: "https://gnoscan.io/tokens/r/demo/wugnot",
  },
};

const TokenDescriptionContainer: React.FC = () => {
  const { getTokenUrl } = useGnoscanUrl();
  const [descriptionInfo, setDescriptionInfo] =
    useState<DescriptionInfo>(descriptionInit);
  const [copied, setCopied] = useState(false);
  const router = useCustomRouter();
  const path = router.getTokenPath();
  const { data: tokenB, isLoading } = useGetToken(path, {
    enabled: !!path,
  });
  const { isLoading: isLoadingCommon } = useLoading();

  const copyClick = async () => {
    try {
      await navigator.clipboard.writeText(descriptionInfo.token.pkg_path);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      throw new Error("Copy Error!");
    }
  };
  useEffect(() => {
    if (tokenB) {
      setDescriptionInfo(() => ({
        token: {
          name: tokenB.name,
          symbol: tokenB.symbol,
          image: tokenB.logoURI,
          pkg_path: tokenB.path,
          decimals: 1,
          description: tokenB.description || "",
          website_url: tokenB.websiteURL || "",
        },
        links: {
          Website: tokenB.websiteURL || "",
          Gnoscan: getTokenUrl(tokenB.path),
        },
      }));
    }
  }, [router.query, tokenB]);

  return (
    <TokenDescription
      tokenName={descriptionInfo.token.name}
      tokenSymbol={descriptionInfo.token.symbol}
      content={descriptionInfo.token.description}
      links={descriptionInfo.links}
      path={descriptionInfo.token.pkg_path}
      loading={isLoading || isLoadingCommon}
      copyClick={copyClick}
      copied={copied}
    />
  );
};

export default TokenDescriptionContainer;
