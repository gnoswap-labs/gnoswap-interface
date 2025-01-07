import React from "react";

/**
 *
 * Custom hooks to manage width values for each element in a given array of items.
 *
 * @template T - Generic parameters that define the item's type
 * @param {T[]} items - Array of items to track width
 * @returns {[number[], React.Dispatch<React.SetStateAction<number[]>>]}
 *          - Returns a tuple of the form [widthList, setWidthList].
 *          - widthList: array containing the width value of each item (initialized to 0)
 *          - setWidthList: setState function to update widthList
 *
 * @example
 * const items = [target1Ref, target2Ref, target3Ref];
 * const [widthList, setWidthList] = useElementWidthList(items);
 * widthList  Initial values: [0, 0, 0]
 *
 */
function useElementWidthList<T>(items: T[]): [number[], React.Dispatch<React.SetStateAction<number[]>>] {
  return React.useState<number[]>(items.map(() => 0));
}

export default useElementWidthList;
