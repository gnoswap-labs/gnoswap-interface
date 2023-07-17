import React, { useMemo } from "react";
import { cx } from "@emotion/css";
import IconStrokeArrowLeft from "@components/common/icons/IconStrokeArrowLeft";
import IconStrokeArrowRight from "@components/common/icons/IconStrokeArrowRight";
import { Button, PaginationItem, PaginationWrapper } from "./Pagination.styles";

interface PaginationProps {
  totalPage: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
  siblingCount?: number;
  boundaryCount?: number;
}

const getLabel = (item: string | number) => {
  if (typeof item === "number") return item;
  else if (item.indexOf("ellipsis") > -1) return "...";
  else if (item.indexOf("prev") > -1)
    return <IconStrokeArrowLeft className="icon-arrow-pagination" />;
  else if (item.indexOf("next") > -1)
    return <IconStrokeArrowRight className="icon-arrow-pagination" />;
  else return item;
};

const range = (start: number, end: number) => {
  const length = end - start + 1;
  return Array.from({ length }).map((_, idx) => idx + start);
};

const Pagination: React.FC<PaginationProps> = ({
  totalPage,
  currentPage,
  onPageChange,
  disabled,
  siblingCount = 2,
  boundaryCount = 1,
}) => {
  const startPages = useMemo(
    () => range(1, Math.min(boundaryCount, totalPage)),
    [boundaryCount, totalPage],
  );

  const endPages = useMemo(
    () =>
      range(
        Math.max(totalPage - boundaryCount + 1, boundaryCount + 1),
        totalPage,
      ),
    [boundaryCount, totalPage],
  );

  const siblingsStart = Math.max(
    Math.min(currentPage + 1 - siblingCount, totalPage - siblingCount * 2),
    boundaryCount + 1,
  );

  const siblingsEnd = Math.min(
    Math.max(currentPage + siblingCount + 1, boundaryCount + siblingCount * 2),
    endPages.length > 0 ? endPages[0] - 1 : totalPage - 1,
  );

  const pageList = [
    "prev",
    ...startPages,
    ...(siblingsStart > boundaryCount + 1 ? ["start-ellipsis"] : []),
    ...range(siblingsStart, siblingsEnd),
    ...(siblingsEnd < totalPage - boundaryCount ? ["end-ellipsis"] : []),
    ...endPages,
    "next",
  ];

  const paginationDetailsObject = pageList.map((item, index) =>
    typeof item === "number"
      ? {
          key: index,
          onClick: () => onPageChange(item - 1),
          disabled,
          selected: item - 1 === currentPage,
          item,
        }
      : {
          key: index,
          onClick: () =>
            onPageChange(item === "next" ? currentPage + 1 : currentPage - 1),
          disabled:
            disabled ||
            item.indexOf("ellipsis") > -1 ||
            (item === "next"
              ? currentPage >= totalPage - 1
              : currentPage - 1 < 0),
          selected: false,
          item,
        },
  );

  return (
    <PaginationWrapper>
      {paginationDetailsObject.map(
        ({ key, disabled, selected, onClick, item }) => (
          <PaginationItem key={key}>
            <Button
              className={cx({ selected: selected })}
              disabled={disabled}
              onClick={onClick}
            >
              {getLabel(item)}
            </Button>
          </PaginationItem>
        ),
      )}
    </PaginationWrapper>
  );
};

export default Pagination;
