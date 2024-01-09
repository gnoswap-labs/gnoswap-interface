import React, { useState, useEffect } from "react";
import TokenDescription from "@components/token/token-description/TokenDescription";
import { useRouter } from "next/router";
import { useGetTokenByPath } from "@query/token";
import { useLoading } from "@hooks/common/use-loading";

export interface DescriptionInfo {
  token: {
    name: string;
    symbol: string;
    image: string;
    pkg_path: string
    decimals: number
    description: string
    website_url: string
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
    image: "/gnos.svg",
    decimals: 1,
    description: "string",
    website_url: "string",
  },
  links: {
    Website: "gnoswap.io",
    Gnoscan: "gnoscan.io/tokens/r_demo_grc20_GNOS",
  },
};

const TokenDescriptionContainer: React.FC = () => {
  const [descriptionInfo, setDescriptionInfo] = useState<DescriptionInfo>(descriptionInit);
  const [copied, setCopied] = useState(false);
  const router = useRouter();
  const path = router.query["tokenB"] as string;
  const { data: tokenB, isLoading } = useGetTokenByPath(path, { enabled: !!path });
  const { isLoadingCommon } = useLoading();

  const copyClick = async () => {
    try {
      await navigator.clipboard.writeText(descriptionInfo.token.pkg_path);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (e) {
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
          Gnoscan: `https://gnoscan.io/tokens/${tokenB.path}`,
        }
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
