import { useMemo } from 'react';

export const usePagination = (props: { currentPage: number; totalPages: number; skipCount: number; limit: number; }) => {

  const { totalPages, skipCount = 2, currentPage, limit } = props;

  const DOTS='…';

  const range = (start:number, end:number) => {
    const length = end - start + 1;
    /*
      Create an array of certain length and set the elements within it from
      start value to end value.
    */
    return Array.from({ length }, (_, idx) => idx + start);
  };

  const paginationRange = useMemo(() => {
    // Our implementation logic will go here

    // Pages count is determined as siblingCount + firstPage + lastPage + currentPage + 2*DOTS
    const totalPageNumbers = skipCount + 5;


    // If the number of pages is less than the page numbers we want to show in our
    // paginationComponent, we return the range [1..totalPages]

    if (totalPageNumbers >= totalPages) {
      return range(1, totalPages);
    }

    // Calculate left and right sibling index and make sure they are within range 1 and totalPages

    const leftSiblingIndex = Math.max(currentPage - skipCount, 1);
    const rightSiblingIndex = Math.min(
      currentPage + skipCount,
      totalPages
    );

    //We do not show dots just when there is just one page number to be inserted between the extremes of sibling and the page limits i.e 1 and totalPages. Hence we are using leftSiblingIndex > 2 and rightSiblingIndex < totalPages - 2

    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPages - 2;

    const firstPageIndex = 1;
    const lastPageIndex = totalPages;


    //Case 2: No left dots to show, but rights dots to be shown

    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = 3 + 2 * skipCount;
      const leftRange = range(1, leftItemCount);

      return [...leftRange, DOTS, totalPages];
    }


    //Case 3: No right dots to show, but left dots to be shown

    if (shouldShowLeftDots && !shouldShowRightDots) {

      const rightItemCount = 3 + 2 * skipCount;
      const rightRange = range(
        totalPages - rightItemCount + 1,
        totalPages
      );
      return [firstPageIndex, DOTS, ...rightRange];
    }

    //Case 4: Both left and right dots to be shown

    if (shouldShowLeftDots && shouldShowRightDots) {
      const middleRange = range(leftSiblingIndex, rightSiblingIndex);
      return [firstPageIndex, DOTS, ...middleRange, DOTS, lastPageIndex];
    }

  }, [totalPages, limit, skipCount, currentPage]);

  return paginationRange;
};
