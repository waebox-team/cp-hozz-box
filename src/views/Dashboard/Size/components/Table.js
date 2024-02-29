import { Box, Flex, IconButton, Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import { flexRender, getCoreRowModel, getSortedRowModel, useReactTable, createColumnHelper } from '@tanstack/react-table';
import { useMemo, useState } from 'react';
import { DeleteIcon, EditIcon } from '@chakra-ui/icons';
import isEmpty from 'lodash/isEmpty';
import { formatDate } from 'utils/helpers';
import { ModalType } from 'constants/common';
import { useDeleteSizeMutation } from 'services/size';
import { toast } from 'components/Toast';

const SizeTable = ({ sizesData, handleUpdateSize, refetch }) => {
  const [sorting, setSorting] = useState([]);
  const columnHelper = createColumnHelper();

  const deleteSizeMutation = useDeleteSizeMutation();

  const handleRowClick = (ticket, type) => {
    handleUpdateSize(ticket, type);
  };

  const handleDeleteSize = async size => {
    const confirmDelete = window.confirm('Bạn có chắc chắn muốn xóa kích thước này không?');
    if (!confirmDelete) {
      return;
    }

    deleteSizeMutation.mutate(
      { id: size?._id },
      {
        onSuccess: () => {
          toast.showMessageSuccess('Xóa kích thước thành công');
          refetch?.();
        },
        onError: () => {
          toast.showMessageError('Xóa kích thước thất bại');
          refetch?.();
        },
      }
    );
  };

  const columns = useMemo(
    () => [
      //   columnHelper.accessor('_id', {
      //     header: 'ID',
      //     cell: info => info.getValue(),
      //   }),
      columnHelper.accessor('name', {
        header: 'Tên',
        cell: info => <Box textTransform="uppercase">{info.renderValue()}</Box>,
      }),
      columnHelper.accessor('createdAt', {
        header: 'Ngày tạo',
        cell: info => formatDate(info.getValue()),
      }),
      columnHelper.accessor('action', {
        header: '',
        cell: info => (
          <Flex alignItems="center" gap={1}>
            <IconButton
              bg="transparent"
              onClick={() => {
                handleRowClick(info?.row?.original, ModalType.Add);
              }}
            >
              <EditIcon cursor="pointer" boxSize={4} />
            </IconButton>
            <IconButton
              bg="transparent"
              onClick={() => {
                handleDeleteSize(info?.row?.original);
              }}
            >
              <DeleteIcon color="red.400" boxSize={4} />
            </IconButton>
          </Flex>
        ),
      }),
    ],
    [sizesData]
  );

  const table = useReactTable({
    data: sizesData || [],
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
              No data
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
