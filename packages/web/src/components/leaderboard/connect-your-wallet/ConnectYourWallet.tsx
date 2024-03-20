import Switch from "@components/common/switch/Switch";
import HideMe from "../hide-me/HideMe";
import { Flex, SwitchWrapper } from "./ConnectYourWallet.styles";

const ConnectYourWallet = ({
  connected,
  isMobile,
  checked,
  onSwitch,
}: {
  connected: boolean;
  isMobile: boolean;
  checked: boolean;
  onSwitch: () => void;
}) => {
  return (
    <Flex>
      {connected && (
        <>
          <HideMe isMobile={isMobile} />
          <SwitchWrapper>
            <Switch checked={checked} onChange={onSwitch} />
          </SwitchWrapper>
        </>
      )}
    </Flex>
  );
};

export default ConnectYourWallet;
