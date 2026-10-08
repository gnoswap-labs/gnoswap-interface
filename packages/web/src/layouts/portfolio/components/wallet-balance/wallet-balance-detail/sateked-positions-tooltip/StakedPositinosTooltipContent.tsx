import React, { useCallback, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

import { getDateUtcToLocal } from "@common/utils/date-util";
import IconLpToken from "@components/common/icons/IconLpToken";
import MissingLogo from "@components/common/missing-logo/MissingLogo";
import type { StakedPositionsTooltipQuery } from "@query/positions/use-get-staked-positions-infinite";
import { formatOtherPrice } from "@utils/new-number-utils";

import * as S from "./StakedPositinosTooltipContent.styles";

const StakedPostionsTooltipContent: React.FC<{
  count: number;
  query: StakedPositionsTooltipQuery;
}> = ({ count, query }) => {
  const { t } = useTranslation();
  const { positions, isLoading, isError, isFetching, isFetchingNextPage, hasNextPage, fetchNextPage } = query;
  const fetchingNextPage = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const loadNextPage = useCallback(async () => {
    if (!hasNextPage || isFetching || fetchingNextPage.current) return;
    fetchingNextPage.current = true;
    try {
      await fetchNextPage();
    } finally {
      fetchingNextPage.current = false;
    }
  }, [fetchNextPage, hasNextPage, isFetching]);

  useEffect(() => {
    const container = containerRef.current;
    if (
      container &&
      !isLoading &&
      !isError &&
      container.clientHeight > 0 &&
      container.scrollHeight <= container.clientHeight
    ) {
      void loadNextPage();
    }
  }, [positions, isLoading, isError, isFetchingNextPage, loadNextPage]);

  const onScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, clientHeight, scrollHeight } = event.currentTarget;
    if (scrollTop > 0 && scrollHeight - scrollTop - clientHeight <= 80 && !isError) {
      void loadNextPage();
    }
  };

  return (
    <S.StakedPostionsTooltipContentWrapper
      ref={containerRef}
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
    </S.StakedPostionsTooltipContentWrapper>
  );
};

export default StakedPostionsTooltipContent;
