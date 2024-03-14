const ConnectYourWallet = ({ isMobile }: { isMobile: boolean }) => {
  return <>{!isMobile && "Connect your wallet to check your points"}</>;
};

export default ConnectYourWallet;
