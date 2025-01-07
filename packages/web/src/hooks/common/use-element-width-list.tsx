import React from "react";

/**
 *
 * Custom hooks to manage width values for each element in a given array of items.
 *
 * @template T - Generic parameters that define the item's type
 * @param {T[]} items - Array of items to track width
 * @param {React.RefObject<HTMLElement>[]} refs - A ref array of elements to measure
 * @param {React.DependencyList} deps - Array of dependencies to trigger width measurements
 * @returns {number[]}
 *          - Return an array of width values for each item
 *          - widthList: array containing the width value of each item (initialized to 0)
 *
 * @example
 * const items = [target1Ref, target2Ref, target3Ref];
 * const widthList = useElementWidtahList(items, refs, []);
 * widthList  Initial values: [0, 0, 0]
 *
 */
function useElementWidthList<T>(
  items: T[],
  refs: React.RefObject<HTMLElement>[],
  dependencies: React.DependencyList = [],
): number[] {
  const [widthList, setWidthList] = React.useState<number[]>(items.map(() => 0));

  React.useEffect(() => {
    const widthValues = refs.map(ref => (ref.current ? ref.current.getBoundingClientRect().width : 0));

    setWidthList(widthValues);
  }, dependencies);

  return widthList;
}

export default useElementWidthList;
