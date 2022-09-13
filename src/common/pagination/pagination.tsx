/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { ChangeEvent, FC, useEffect, useState } from 'react';
import { usePagination } from '../../hooks/usePagination';
import { PaginationProps } from './paginationTypes';
import nextIcon from '../../assets/images/next-page-icon.svg';
import prevIcon from '../../assets/images/previous-page-icon.svg';
import Input from '../input';
import * as Yup from 'yup';
import useDebounce from '@/hooks/useDebounce';

const Pagination: FC<PaginationProps> = (props) => {
  const { onPageChange, totalPages, skipCount = 2, currentPage, limit } = props;

  const [errorMessage, setErrorMessage] = useState<string | unknown>('');
  const [pageNumber, setPageNumber] = useState<string>('');
  const debouncedValue = useDebounce(pageNumber, 700);

  const paginationRange = usePagination({ currentPage, totalPages, skipCount, limit }) ?? [1];

  // Returns the debounced value of the pageNumber.
  useEffect(() => {
    if (debouncedValue) {
      if (Number(debouncedValue) === 0 || totalPages < Number(debouncedValue) || !debouncedValue) {
        onPageChange(1);
      } else {
        onPageChange(debouncedValue);
      }
    }
  }, [debouncedValue]);

  // If there are less than 2 times in pagination range we shall not render the component
  if (currentPage === 0 || (paginationRange && paginationRange!.length < 2)) {
    return null;
  }

  const onNext = () => {
    onPageChange(currentPage + 1);
  };

  const onPrevious = () => {
    onPageChange(currentPage - 1);
  };

  const handlePageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const pageNumberValue = event.target.value;
    setPageNumber(pageNumberValue);
    try {
      PaginationValidation.validateSync(pageNumberValue);
      setErrorMessage('');
    } catch ({ message }) {
      setErrorMessage(message);
    }
  };

  const lastPage = paginationRange && paginationRange![paginationRange!.length - 1];

  const PaginationValidation = Yup.number().positive();

  return (
    <>
      <div
        className={`pagination w-1.51 h-1.51 box-border rounded flex items-center justify-center cursor-pointer ${
          currentPage === 1 ? 'pointer-events-none' : ''
        }`}
        onClick={onPrevious}
      >
        <img src={prevIcon} alt="" />
      </div>
      {paginationRange &&
        paginationRange!.map((pageNumber, index) => {
          // If the pageItem is a DOT, render the DOTS unicode character
          if (pageNumber === '...') {
            return <div className="font-Lato font-normal text-error leading-4 text-pagination cursor-pointer">...</div>;
          }
          return (
            <div
              key={index}
              className={`font-Lato font-normal text-error leading-4 cursor-pointer ${
                currentPage === pageNumber ? 'text-paginationArrowButton font-extrabold' : 'text-pagination'
              }`}
              onClick={() => onPageChange(pageNumber)}
            >
              {pageNumber}
            </div>
          );
        })}

      <div
        className={`pagination w-1.51 h-1.51 box-border rounded flex items-center justify-center cursor-pointer ${
          currentPage === lastPage ? 'pointer-events-none' : ''
        }`}
        onClick={onNext}
      >
        <img src={nextIcon} alt="" />
      </div>
      <div className="font-Lato font-normal text-pageNumber leading-4 text-pagination cursor-pointer">Go to page:</div>
      <div>
        <Input
          name="pagination"
          id="page"
          type="text"
          className="page-input focus:outline-none px-0.5 rounded box-border w-1.47 h-1.51"
          onChange={handlePageChange}
          value={pageNumber}
          errors={Boolean(errorMessage)}
        />
      </div>
    </>
  );
};

export default Pagination;
