import { TokenModel } from "@models/token/token-model";
import React from "react";

export interface TokenLogoProps {
  className?: string;
  token: TokenModel;
}

const TokenLogo: React.FC<TokenLogoProps> = ({ className, token }) => {
  return token?.logoURI ?
    <img className={"token-logo " + className} src={token.logoURI} alt="token logo" /> :
    <div className={"missing-logo " + className} >{token.symbol.slice(0, 3)}</div>;
};

export default TokenLogo;