import WalletConnectorMenu from "@components/common/wallet-connector-menu/WalletConnectorMenu";
import HeaderContainer from "@containers/header-container/HeaderContainer";
import { useRouter } from "next/router";

export default function Swap() {
  const router = useRouter();
  const { from, to } = router.query;

  return (
    <div>
      <HeaderContainer />
      <h1>Swap</h1>
      {from && <div>from: {from}</div>}
      {to && <div>to: {to}</div>}
    </div>
  );
}
