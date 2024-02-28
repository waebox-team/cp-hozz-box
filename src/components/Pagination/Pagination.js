import { TablePagination } from '@trendmicro/react-paginations';
import React from 'react';

const Pagination = ({ type = 'full', page, pageLength, totalRecords, onPageChange }) => {
  return (
    <TablePagination
      type={type}
      page={page}
      pageLength={pageLength}
      totalRecords={totalRecords}
      onPageChange={({ page, pageLength }) => {
        onPageChange?.(page, pageLength);
      }}
      prevPageRenderer={() => <i className="fa fa-angle-left" />}
      nextPageRenderer={() => <i className="fa fa-angle-right" />}
    />
  );
};

export default Pagination;
