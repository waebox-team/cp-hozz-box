import { Box, Table, Tbody, Td, Text, Tfoot, Th, Thead, Tr } from '@chakra-ui/react';
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  createColumnHelper,
} from '@tanstack/react-table';
import { Fragment, useMemo, useState } from 'react';
import sum from 'lodash/sum';
import map from 'lodash/map';
import isEmpty from 'lodash/isEmpty';

const calculatePercentage = (numerator, denominator) => {
    if(denominator === 0) return 0;
  const result = (numerator / denominator) * 100;
  return result.toFixed(3);
};

const StatisticsTable = ({ data, title }) => {
  const [sorting, setSorting] = useState([]);
  const columnHelper = createColumnHelper();

  const columns = useMemo(
    () => [
      columnHelper.accessor('_id', {
        header: title,
        cell: info => info.getValue(),
        footer: <Text>Tổng</Text>,
      }),
      columnHelper.accessor('count', {
        header: 'Impressions',
        cell: info => info.getValue(),
        footer: <Text>{sum(map(data, d => d.count)) || 0}</Text>,
      }),
      columnHelper.accessor('countclick', {
        header: 'Clicks',
        cell: info => info.getValue() || 0,
        footer: <Text>{sum(map(data, d => d.countclick)) || 0}</Text>,
      }),
      columnHelper.accessor('total', {
        header: 'CTR',
        cell: info => calculatePercentage(info.row.original.countclick, info.row.original.count) + '%' || 0,
        footer: <Text>{calculatePercentage(sum(map(data, d => d.countclick)), sum(map(data, d => d.count))) + '%' || 0}</Text>,
      }),
      columnHelper.accessor('totalAmount', {
        header: 'CPM',
        cell: info => info.renderValue() || 0,
        footer: <Text>{sum(map(data, d => d.totalAmount)) || 0}</Text>,
      }),
    ],
    [data, title]
  );

  const table = useReactTable({
    data: data || [],
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
    <>
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
              <Td textAlign="center" colSpan={5}>
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
        <Tfoot>
          {table.getFooterGroups().map(footerGroup => (
            <Tr key={footerGroup.id}>
              {footerGroup.headers.map(header => (
                <Fragment key={header.id}>
                  {['createdAt'].includes(header.column.id) ? null : (
                    <Th fontSize={14}>{header.isPlaceholder ? null : flexRender(header.column.columnDef.footer, header.getContext())}</Th>
                  )}
                </Fragment>
              ))}
            </Tr>
          ))}
        </Tfoot>
      </Table>
    </>
  );
};

export default StatisticsTable;
