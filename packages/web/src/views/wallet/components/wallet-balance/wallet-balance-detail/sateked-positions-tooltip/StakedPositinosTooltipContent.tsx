import React from "react";
import { useTranslation } from "react-i18next";

import { getDateUtcToLocal } from "@common/utils/date-util";
import DoubleLogo from "@components/common/double-logo/DoubleLogo";
import { TokenModel } from "@models/token/token-model";
import { formatOtherPrice } from "@utils/new-number-utils";

import * as S from "./StakedPositinosTooltipContent.styles";

type StakedPostionsTooltipContentProps = {
  poolStakings: {
    tokenA: TokenModel;
    tokenB: TokenModel;
    lpId: string;
    totalValue: string;
    stakedDate: string;
  }[];
};

const StakedPostionsTooltipContent: React.FC<
  StakedPostionsTooltipContentProps
> = ({ poolStakings }) => {
  const { t } = useTranslation();

  return (
    <S.StakedPostionsTooltipContentWrapper key={JSON.stringify(poolStakings)}>
      {[...poolStakings]
        .map((item, index) => {
          return (
            <>
              <S.TokenItem key={index}>
                <S.ItemHeader>
                  <DoubleLogo
                    left={item.tokenA.logoURI}
                    right={item.tokenB.logoURI}
                    size={18}
                  />
                  <S.ItemHeaderSymbol>ID #{item.lpId}</S.ItemHeaderSymbol>
                </S.ItemHeader>
                <S.DataGrid>
                  <S.DataGridItem>
                    <S.ItemDataGridLabel>
                      {t("Wallet:overral.stakedPosi.dataTooltip.totalValue")}
                    </S.ItemDataGridLabel>
                    <S.ItemDataGridValue>
                      {formatOtherPrice(item.totalValue, { isKMB: false })}
                    </S.ItemDataGridValue>
                  </S.DataGridItem>
                </S.DataGrid>
                <S.DataGrid>
                  <S.DataGridItem>
                    <S.ItemDataGridLabel>
                      {t("Wallet:overral.stakedPosi.dataTooltip.date")}
                    </S.ItemDataGridLabel>
                    <S.ItemDataGridValue>
                      {getDateUtcToLocal(item.stakedDate).value}{" "}
                    </S.ItemDataGridValue>
                  </S.DataGridItem>
                </S.DataGrid>
              </S.TokenItem>
              {index !== poolStakings.length - 1 && (
                <S.Divider key={`div-${index}`} />
              )}
            </>
          );
        })}
    </S.StakedPostionsTooltipContentWrapper>
  );
};

export default StakedPostionsTooltipContent;
