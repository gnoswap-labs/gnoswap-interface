import { AmountConverter } from "@services/converters/common/amount";

import { GNS_TOKEN } from "@common/values/token-constant";
import { DashboardTokenResponse } from "@repositories/dashboard";
import { DEFAULT_DASHBOARD_TOKEN_INFO } from "@common/values/default-object/explore-dashboard/dashboard-token-info";

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
}
