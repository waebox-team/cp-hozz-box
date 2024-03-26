import { Box, Flex, IconButton, Image, Switch, Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import { flexRender, getCoreRowModel, getSortedRowModel, useReactTable, createColumnHelper } from '@tanstack/react-table';
import { useMemo, useState } from 'react';
import { DeleteIcon, EditIcon } from '@chakra-ui/icons';
import isEmpty from 'lodash/isEmpty';
import { useHistory } from 'react-router-dom';
import { formatDate } from 'utils/helpers';
import { ROOT_API } from 'constants/common';
import { toast } from 'components/Toast';
import { useMutationDeleteCommentByAdmin } from 'services/comment';

const CountryTable = ({ states, refetch }) => {
  const [sorting, setSorting] = useState([]);
  const columnHelper = createColumnHelper();

  const deleteCommentMutation = useMutationDeleteCommentByAdmin();

  const handleDeleteComment = comment => {
    const confirmDelete = window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này không?');
    if (!confirmDelete) {
      return;
    }

    deleteCommentMutation.mutate(
      { commentId: comment?._id },
      {
        onSuccess: () => {
          toast.showMessageSuccess('Xóa sản phẩm thành công');
          refetch?.();
        },
        onError: () => {
          toast.showMessageError('Xóa sản phẩm thất bại');
          refetch?.();
        },
      }
    );
  };

  const columns = useMemo(
    () => [
      columnHelper.accessor('name', {
        header: 'Tên thành phố',
        cell: info => <Box minW="100px" maxW="250px">{info.renderValue()}</Box>,
      }),
      columnHelper.accessor('state_code', {
        header: 'Mã thành phố',
        cell: info => info.renderValue(),
      }),
      columnHelper.accessor('tax', {
        header: 'Thuế',
        cell: info => info.getValue(),
      }),
    ],
    [states]
  );

  const table = useReactTable({
    data: states || [],
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
            {console.log(headerGroup)}
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
            <Td textAlign="center" colSpan={10}>
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

export default CountryTable;
