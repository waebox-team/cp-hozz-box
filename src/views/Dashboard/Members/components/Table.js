import { Box, Table, Tbody, Td, Text, Th, Thead, Tr } from '@chakra-ui/react';
import { flexRender, getCoreRowModel, getSortedRowModel, useReactTable, createColumnHelper } from '@tanstack/react-table';
import { useMemo, useState } from 'react';
import isEmpty from 'lodash/isEmpty';
import { formatDate } from 'utils/helpers';

const SizeTable = ({ categorysData, handleUpdateCategory, refetch }) => {
  const [sorting, setSorting] = useState([]);
  const columnHelper = createColumnHelper();

  // const handleRowClick = (ticket, type) => {
  //   handleUpdateCategory(ticket, type);
  // };

  const columns = useMemo(
    () => [
      columnHelper.accessor('username', {
        header: 'Tên',
        cell: info => info.getValue(),
      }),

      columnHelper.accessor('email', {
        header: 'Email',
        cell: info => info.getValue(),
      }),

      columnHelper.accessor('gender', {
        header: 'Giới tính',
        cell: info => info.getValue(),
      }),

      columnHelper.accessor('balance', {
        header: 'Số dư',
        cell: info => info.getValue(),
      }),

      columnHelper.accessor('createdAt', {
        header: 'Ngày tạo',
        cell: info => <Text whiteSpace={'nowrap'}>{formatDate(info.row.original.createdAt, 'hA MMM Do YYYY')}</Text>,
      }),

      columnHelper.accessor('status', {
        header: 'Trạng thái',
        cell: info => info.getValue(),
      }),

      // columnHelper.accessor('action', {
      //   header: '',
      //   cell: info => (
      //     <Flex alignItems="center" gap={1}>
      //       <IconButton
      //         bg="transparent"
      //         onClick={() => {
      //           // handleRowClick(info?.row?.original, ModalType.Add);
      //         }}
      //       >
      //         <BiCommentDetail cursor="pointer" size={18} />
      //       </IconButton>
      //     </Flex>
      //   ),
      // }),
    ],
    [categorysData]
  );

  const table = useReactTable({
    data: categorysData || [],
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
            <Td textAlign="center" colSpan={6}>
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

export default SizeTable;
