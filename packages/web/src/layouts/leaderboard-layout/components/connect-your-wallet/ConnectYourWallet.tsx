import React from "react";
import Switch from "@components/common/switch/Switch";
import HideMe from "../hide-me/HideMe";
import { Flex, SwitchWrapper } from "./ConnectYourWallet.styles";

const ConnectYourWallet = ({
  connected,
  isMobile,
  checked,
  disabled,
  onSwitch,
}: {
  connected: boolean;
  isMobile: boolean;
  checked: boolean;
  disabled: boolean;
  onSwitch: () => void;
}) => {
  return (
    <Flex>
      {connected && (
        <>
          <HideMe isMobile={isMobile} />
          <SwitchWrapper>
            <Switch checked={checked} onChange={onSwitch} disabled={disabled} />
          </SwitchWrapper>
        </>
      )}
    </Flex>
  );
};

export default ConnectYourWallet;
