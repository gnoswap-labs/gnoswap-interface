import React from "react";
import { SocialWalletContext } from "@providers/social-wallet-provider/SocialWalletProvider";
import { CommonError } from "@common/errors";

export const useSocialWalletContext = () => {
  const context = React.useContext(SocialWalletContext);
  if (!context) {
    throw new CommonError("FAILED_INITIALIZE_SOCIAL_WALLET");
  }
  return context;
};
