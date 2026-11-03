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
  compact?: boolean;
}

const getLabel = (item: string | number) => {
  if (typeof item === "number") return item;
  else if (item.indexOf("ellipsis") > -1) return "...";
  else if (item.indexOf("prev") > -1) return <IconStrokeArrowLeft className="icon-arrow-pagination" />;
  else if (item.indexOf("next") > -1) return <IconStrokeArrowRight className="icon-arrow-pagination" />;
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
  compact = false,
}) => {
  const startPages = useMemo(() => range(1, Math.min(boundaryCount, totalPage)), [boundaryCount, totalPage]);

  const endPages = useMemo(
    () => range(Math.max(totalPage - boundaryCount + 1, boundaryCount + 1), totalPage),
    [boundaryCount, totalPage],
  );

  // Reuse missing sibling/ellipsis slots near either edge so the control count stays fixed.
  const siblingsStart = Math.max(
    Math.min(currentPage - siblingCount, totalPage - boundaryCount - siblingCount * 2 - 1),
    boundaryCount + 2,
  );

  const siblingsEnd = Math.min(
    Math.max(currentPage + siblingCount, boundaryCount + siblingCount * 2 + 2),
    endPages.length > 0 ? endPages[0] - 2 : totalPage - 1,
  );

  const pageList = [
    "prev",
    ...startPages,
    ...(siblingsStart > boundaryCount + 2
      ? ["start-ellipsis"]
      : boundaryCount + 1 < totalPage - boundaryCount
      ? [boundaryCount + 1]
      : []),
    ...range(siblingsStart, siblingsEnd),
    ...(siblingsEnd < totalPage - boundaryCount - 1
      ? ["end-ellipsis"]
      : totalPage - boundaryCount > boundaryCount
      ? [totalPage - boundaryCount]
      : []),
    ...endPages,
    "next",
  ];

  const paginationDetailsObject = pageList.map((item, index) =>
    typeof item === "number"
      ? {
          key: index,
          onClick: () => onPageChange(item),
          disabled,
          selected: item === currentPage,
          item,
        }
      : {
          key: index,
          onClick: () => onPageChange(item === "next" ? currentPage + 1 : currentPage - 1),
          disabled:
            disabled ||
            item.indexOf("ellipsis") > -1 ||
            (item === "next" ? currentPage >= totalPage : currentPage <= 1),
          selected: false,
          item,
        },
  );

  return (
    <PaginationWrapper>
      {paginationDetailsObject.map(({ key, disabled, selected, onClick, item }) => (
        <PaginationItem key={key}>
          <Button className={cx({ selected: selected })} disabled={disabled} onClick={onClick} compact={compact}>
            {getLabel(item)}
          </Button>
        </PaginationItem>
      ))}
    </PaginationWrapper>
  );
};

export default Pagination;
