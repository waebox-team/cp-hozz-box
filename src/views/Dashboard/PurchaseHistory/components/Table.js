import { Box, Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import { flexRender, getCoreRowModel, getSortedRowModel, useReactTable, createColumnHelper } from '@tanstack/react-table';
import { useMemo, useState } from 'react';
import isEmpty from 'lodash/isEmpty';
import { formatDate } from 'utils/helpers';

const PurchaseHistoryTable = ({ purchaseHistoryData }) => {
  const [sorting, setSorting] = useState([]);
  const columnHelper = createColumnHelper();

  const columns = useMemo(
    () => [
      columnHelper.accessor('memberId', {
        header: 'Người đặt hàng',
        cell: info => info.getValue()?.username,
      }),
      columnHelper.accessor('order_no', {
        header: 'Mã đơn hàng',
        cell: info => info.getValue(),
      }),
      columnHelper.accessor('amount_total', {
        header: 'Giá',
        cell: info => info.getValue().toLocaleString('vi', { style: 'currency', currency: 'VND' }),
      }),
      columnHelper.accessor('mode', {
        header: 'Phương thức thanh toán',
        cell: info => info.getValue(),
      }),
      columnHelper.accessor('payment_status', {
        header: 'Trạng thái Thanh toán',
        cell: info => info.getValue(),
      }),
      columnHelper.accessor('status', {
        header: 'Trạng thái Đơn hàng',
        cell: info => info.getValue(),
      }),
      columnHelper.accessor('createdAt', {
        header: 'Ngày tạo',
        cell: info => formatDate(info.getValue()),
      }),
    ],
    [purchaseHistoryData]
  );

  const table = useReactTable({
    data: purchaseHistoryData || [],
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    debugTable: true,
  });

  return (
    <Table>
      <Thead>
        {table.getHeaderGroups().map(headerGroup => (
          <Tr key={headerGroup.id}>
            {headerGroup.headers.map(header => (
              <Th key={header.id} w="120px">
                {header.isPlaceholder ? null : (
                  <Box cursor={header.column.getCanSort() ? 'pointer' : 'default'} onClick={header.column.getToggleSortingHandler()}>
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {{
                      asc: ' 🔼',
                      desc: ' 🔽',
                    }[header.column.getIsSorted()] ?? null}
                  </Box>
                )}
              </Th>
            ))}
          </Tr>
        ))}
      </Thead>
      <Tbody>
        {isEmpty(table.getRowModel().rows) ? (
          <Tr>
            <Td textAlign="center" colSpan={7}>
              Không có dữ liệu
            </Td>
          </Tr>
        ) : (
          table.getRowModel().rows.map(row => (
            <Tr key={row.id}>
              {row.getVisibleCells().map(cell => (
                <Td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</Td>
              ))}
            </Tr>
          ))
        )}
      </Tbody>
    </Table>
  );
};

export default PurchaseHistoryTable;
