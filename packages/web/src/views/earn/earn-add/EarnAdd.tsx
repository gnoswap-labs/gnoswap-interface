import { useAtom } from "jotai";
import { useTranslation } from "react-i18next";

import Footer from "@components/common/footer/Footer";
import BreadcrumbsContainer from "@containers/breadcrumbs-container/BreadcrumbsContainer";
import EarnAddLiquidityContainer from "@containers/earn-add-liquidity-container/EarnAddLiquidityContainer";
import ExchangeRateGraphContainer from "@containers/exchange-rate-graph-container/ExchangeRateGraphContainer";
import HeaderContainer from "@containers/header-container/HeaderContainer";
import QuickPoolInfoContainer from "@containers/quick-pool-info-container/QuickPoolInfoContainer";
import { EarnState } from "@states/index";

import EarnAddLayout from "./EarnAddLayout";

const EarnAdd: React.FC = () => {
  const { t } = useTranslation();
  const [isEarnAdd] = useAtom(EarnState.isEarnAdd);
  const listBreadcrumb = [
    { title: t("business:pageHeader.earn"), path: "/earn" },
    { title: t("business:pageHeader.addPosi"), path: "" },
  ];

  return (
    <EarnAddLayout
      header={<HeaderContainer />}
      breadcrumbs={<BreadcrumbsContainer listBreadcrumb={listBreadcrumb} />}
      addLiquidity={<EarnAddLiquidityContainer />}
      quickPoolInfo={isEarnAdd ? <QuickPoolInfoContainer /> : null}
      exchangeRateGraph={<ExchangeRateGraphContainer />}
      footer={<Footer />}
    />
  );
};

export default EarnAdd;