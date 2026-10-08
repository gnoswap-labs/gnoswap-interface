import React, { useRef } from "react";
import { useTranslation } from "react-i18next";

import { getDateUtcToLocal } from "@common/utils/date-util";
import IconLpToken from "@components/common/icons/IconLpToken";
import MissingLogo from "@components/common/missing-logo/MissingLogo";
import { useGetStakedPositionsInfinite } from "@query/positions/use-get-staked-positions-infinite";
import { formatOtherPrice } from "@utils/new-number-utils";

import * as S from "./StakedPositinosTooltipContent.styles";

const StakedPostionsTooltipContent: React.FC<{ count: number }> = ({ count }) => {
  const { t } = useTranslation();
  const { positions, isLoading, isError, isFetchingNextPage, hasNextPage, fetchNextPage, refetch } =
    useGetStakedPositionsInfinite();
  const fetchingNextPage = useRef(false);

  const loadNextPage = async () => {
    if (!hasNextPage || isFetchingNextPage || fetchingNextPage.current) return;
    fetchingNextPage.current = true;
    try {
      await fetchNextPage();
    } finally {
      fetchingNextPage.current = false;
    }
  };

  const onScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, clientHeight, scrollHeight } = event.currentTarget;
    if (scrollTop > 0 && scrollHeight - scrollTop - clientHeight <= 80 && !isError) {
      void loadNextPage();
    }
  };

  return (
    <S.StakedPostionsTooltipContentWrapper
      tabIndex={0}
      role="region"
      aria-label={`${t("Wallet:overral.stakedPosi.label")} (${count})`}
      aria-busy={isLoading || isFetchingNextPage}
      onScroll={onScroll}
    >
      {positions.map((item, index) => (
        <React.Fragment key={item.lpTokenId}>
          <S.TokenItem>
            <S.ItemHeader>
              <MissingLogo
                url={item.tokenUri}
                fallback={<IconLpToken />}
                symbol={`ID #${item.lpTokenId}`}
                width={18}
                mobileWidth={16}
              />
              <S.ItemHeaderSymbol>ID #{item.lpTokenId}</S.ItemHeaderSymbol>
            </S.ItemHeader>
            <S.DataGrid>
              <S.DataGridItem>
                <S.ItemDataGridLabel>{t("Wallet:overral.stakedPosi.dataTooltip.totalValue")}</S.ItemDataGridLabel>
                <S.ItemDataGridValue>{formatOtherPrice(item.stakedUsdValue, { isKMB: false })}</S.ItemDataGridValue>
              </S.DataGridItem>
            </S.DataGrid>
            <S.DataGrid>
              <S.DataGridItem>
                <S.ItemDataGridLabel>{t("Wallet:overral.stakedPosi.dataTooltip.date")}</S.ItemDataGridLabel>
                <S.ItemDataGridValue>{getDateUtcToLocal(item.stakedAt).value}</S.ItemDataGridValue>
              </S.DataGridItem>
            </S.DataGrid>
          </S.TokenItem>
          {index !== positions.length - 1 && <S.Divider />}
        </React.Fragment>
      ))}
      {(isLoading || isFetchingNextPage) && (
        <S.Status role="status">{t("Wallet:overral.stakedPosi.dataTooltip.loading")}</S.Status>
      )}
      {!isLoading && !isError && positions.length === 0 && (
        <S.Status role="status">{t("Wallet:overral.stakedPosi.dataTooltip.empty")}</S.Status>
      )}
      {isError && (
        <S.Status role="alert">
          {t("Wallet:overral.stakedPosi.dataTooltip.error")}
          <S.RetryButton type="button" onClick={() => (positions.length > 0 ? void loadNextPage() : void refetch())}>
            {t("Wallet:overral.stakedPosi.dataTooltip.retry")}
          </S.RetryButton>
        </S.Status>
      )}
    </S.StakedPostionsTooltipContentWrapper>
  );
};

export default StakedPostionsTooltipContent;
