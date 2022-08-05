/* eslint-disable no-unused-vars */
export type PaginationProps = {
  onPageChange:(value: number | string) => void;
  totalPages: number;
  currentPage: number;
  limit: number;
  skipCount?: number;
};
