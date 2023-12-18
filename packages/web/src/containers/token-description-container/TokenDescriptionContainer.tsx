import React, { useState, useEffect } from "react";
import TokenDescription from "@components/token/token-description/TokenDescription";
import { useRouter } from "next/router";
import { useGetTokensList } from "@query/token";
import { TokenModel } from "@models/token/token-model";

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
  const { data: { tokens = [] } = {}, isLoading } = useGetTokensList();
  const [copied, setCopied] = useState(false);
  const router = useRouter();

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
    const currentToken: TokenModel = tokens.filter((item: TokenModel) => item.symbol === router.query["token-path"])[0];
    if (currentToken) {
      setDescriptionInfo(() => ({
        token: {
          name: currentToken.name,
          symbol: currentToken.symbol,
          image: currentToken.logoURI,
          pkg_path: currentToken.path,
          decimals: 1,
          description: currentToken.description || "",
          website_url: currentToken.websiteURL || "",
        },
        links: {
          Website: currentToken.websiteURL || "",
          Gnoscan: `https://gnoscan.io/tokens/${currentToken.path}`,
        }
      }));
    }
  }, [router.query, tokens]);

  return (
    <TokenDescription
      tokenName={descriptionInfo.token.name}
      tokenSymbol={descriptionInfo.token.symbol}
      content={descriptionInfo.token.description}
      links={descriptionInfo.links}
      path={descriptionInfo.token.pkg_path}
      loading={isLoading}
      copyClick={copyClick}
      copied={copied}
    />
  );
};

export default TokenDescriptionContainer;
