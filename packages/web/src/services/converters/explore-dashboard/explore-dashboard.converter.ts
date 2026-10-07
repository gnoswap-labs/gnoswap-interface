import { AmountConverter } from "@services/converters/common/amount";

import { GNS_TOKEN, XGNS_TOKEN } from "@common/values/token-constant";
import { DashboardTokenResponse, GovernanceOverviewResponse } from "@repositories/dashboard";
import { DEFAULT_DASHBOARD_TOKEN_INFO } from "@common/values/default-object/explore-dashboard/dashboard-token-info";
import { ActivityData, emptyToken } from "@repositories/activity/responses/activity-responses";
import { DEFAULT_GOVERNANCE_OVERVIEW_INFO } from "@common/values/default-object/explore-dashboard/governance-overview-info";

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
      gnsMaxSupply: AmountConverter.convertSingle(GNS_TOKEN, data.gnsMaxSupply),
      gnsTotalStaked: AmountConverter.convertSingle(GNS_TOKEN, data.gnsTotalStaked),
    };
  }

  /**
   * Convert raw governance overview data to display format
   * Converts XGNS token amounts to safe number format while preserving other fields
   *
   * @param data - raw governance overview response from API (can be null)
   * @returns governance overview data with converted XGNS amounts as numbers (default values if input is invalid)
   */
  static convertGovernanceOverview(data: GovernanceOverviewResponse | null): GovernanceOverviewResponse {
    if (!data) {
      return DEFAULT_GOVERNANCE_OVERVIEW_INFO;
    }

    return {
      ...data,
      totalDelegated: this.safeConvertToNumber(AmountConverter.convertSingle(XGNS_TOKEN, data.totalDelegated)),
      xgnsTotalSupply: this.safeConvertToNumber(AmountConverter.convertSingle(XGNS_TOKEN, data.xgnsTotalSupply)),
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
        tokenBAmount: AmountConverter.convertSingle(activity.tokenB ?? emptyToken, activity.tokenBAmount),
      };
    });
  }

  /**
   * Safely convert a value to number type with fallback to 0
   * Handles null, undefined, and invalid number conversions (NaN)
   *
   * @param value - value to convert (string, number, null, or undefined)
   * @returns converted number value, or 0 if conversion fails or value is null/undefined
   *
   * @example
   * safeConvertToNumber("123") // returns 123
   * safeConvertToNumber(null) // returns 0
   * safeConvertToNumber("invalid") // returns 0
   */
  private static safeConvertToNumber(value: string | number | null | undefined): number {
    if (value == null) {
      return 0;
    }

    const converted = Number(value);
    return Number.isNaN(converted) ? 0 : converted;
  }
}
