import { LaunchpadProjectModel } from "@models/launchpad";
import { SortDirection, TABLE_HEAD } from "@layouts/launchpad/components/launchpad-project-list/types";

type SortComparator<T> = (a: T, b: T) => number;
type PoolKey = keyof NonNullable<LaunchpadProjectModel["pools"][0]>;
type PoolAggregator = (project: LaunchpadProjectModel) => number;

type SortStrategies = {
  [K in TABLE_HEAD]: SortComparator<LaunchpadProjectModel>;
};

const safeArray = <T>(arr: T[] | null | undefined): T[] => (Array.isArray(arr) ? arr : []);

const sortValueTransform = (value: string): number => {
  if (!value || value === "-") return -Infinity;

  const sanitized = value.replace(/[^\d.-]/g, "");
  const number = Number(sanitized);
  return isNaN(number) ? -Infinity : number;
};

const createStringComparator = (
  extractor: (model: LaunchpadProjectModel) => string,
): SortComparator<LaunchpadProjectModel> => {
  return (a, b) => (extractor(a) || "").localeCompare(extractor(b) || "");
};

const createPoolAggregator = (key: PoolKey, aggregator: (values: number[]) => number): PoolAggregator => {
  return (project: LaunchpadProjectModel): number => {
    const pools = safeArray(project.pools);
    const values = pools.map(pool => sortValueTransform(String(pool?.[key] || 0)));
    return aggregator(values);
  };
};

const createNumberComparator = (extractor: PoolAggregator): SortComparator<LaunchpadProjectModel> => {
  return (a, b) => extractor(a) - extractor(b);
};

const sortStrategies: SortStrategies = {
  [TABLE_HEAD.PROJECT]: createStringComparator(model => model.name),
  [TABLE_HEAD.STATUS]: createStringComparator(model => model.status),
  [TABLE_HEAD.APR]: createNumberComparator(createPoolAggregator("apr", values => Math.max(...values, -Infinity))),
  [TABLE_HEAD.PARTICIPANTS]: createNumberComparator(
    createPoolAggregator("participant", values => values.reduce((sum, val) => sum + val, 0)),
  ),
  [TABLE_HEAD.TOTAL_ALLOCATION]: createNumberComparator(
    createPoolAggregator("allocation", values => values.reduce((sum, val) => sum + val, 0)),
  ),
  [TABLE_HEAD.TOTAL_DEPOSIT]: createNumberComparator(
    createPoolAggregator("depositAmount", values => values.reduce((sum, val) => sum + val, 0)),
  ),
  [TABLE_HEAD.SWAP]: () => 0,
};

export const getSortFunction = (key: TABLE_HEAD, direction: SortDirection) => {
  return (a: LaunchpadProjectModel, b: LaunchpadProjectModel) => {
    const multiplier = direction === SortDirection.ASC ? 1 : -1;

    try {
      const comparator = sortStrategies[key];
      return multiplier * comparator(a, b);
    } catch (error) {
      console.error("Error during sort:", error);
      return 0;
    }
  };
};
