import { AmountConverter } from "@services/converters/common/amount";

import { GNS_TOKEN } from "@common/values/token-constant";
import { DashboardTokenResponse } from "@repositories/dashboard";
import { DEFAULT_DASHBOARD_TOKEN_INFO } from "@common/values/default-object/explore-dashboard/dashboard-token-info";
import { ActivityData } from "@repositories/activity/responses/activity-responses";

/**
 * Utility class responsible for converting dashboard token data
 * Converts raw GNS token amounts from API responses to display format
 */
export class ExploreDashboardConverter {
  /**
   * Convert raw dashboard token data to display format
   * Converts all GNS-related amounts using AmountConverter while preserving price fields
   *
   * @param data - raw dashboard token response from API (can be null/undefined)
   * @returns dashboard token data with converted GNS amounts (default values if input is invalid)
   */
  static convertDashboardToken(data: DashboardTokenResponse | null | undefined): DashboardTokenResponse {
    if (!data) {
      return DEFAULT_DASHBOARD_TOKEN_INFO;
    }

    return {
      ...data,
      gnsCirculatingSupply: AmountConverter.convertSingle(GNS_TOKEN, data.gnsCirculatingSupply),
      gnsDailyBlockEmissions: AmountConverter.convertSingle(GNS_TOKEN, data.gnsDailyBlockEmissions),
      gnsTotalSupply: AmountConverter.convertSingle(GNS_TOKEN, data.gnsTotalSupply),
      gnsTotalStaked: AmountConverter.convertSingle(GNS_TOKEN, data.gnsTotalStaked),
    };
  }

  /**
   * Convert dashboard activity list with token amounts to display format
   * Converts raw token amounts for both tokenA and tokenB in each activity using their respective token models
   *
   * @param activityList - array of activity data from API (can be null/undefined)
   * @returns array of activity data with converted token amounts (empty array if input is invalid)
   */
  static convertDashboardActivityList(activityList: ActivityData[] | null | undefined): ActivityData[] {
    if (!activityList) return [];

    return [...activityList].map((activity: ActivityData) => {
      return {
        ...activity,
        tokenAAmount: AmountConverter.convertSingle(activity.tokenA, activity.tokenAAmount),
        tokenBAmount: AmountConverter.convertSingle(activity.tokenB, activity.tokenBAmount),
      };
    });
  }
}
