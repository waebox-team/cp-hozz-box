import { Box, Flex, IconButton, Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import { flexRender, getCoreRowModel, getSortedRowModel, useReactTable, createColumnHelper } from '@tanstack/react-table';
import { useMemo, useState } from 'react';
import { DeleteIcon, EditIcon } from '@chakra-ui/icons';
import isEmpty from 'lodash/isEmpty';
import { formatDate } from 'utils/helpers';
import { ModalType } from 'constants/common';
import { toast } from 'components/Toast';
import { useDeleteColorMutation } from 'services/color';

const ColorTable = ({ colorsData, handleUpdateColor, refetch }) => {
  const [sorting, setSorting] = useState([]);
  const columnHelper = createColumnHelper();

  const deleteColorMutation = useDeleteColorMutation();

  const handleRowClick = (ticket, type) => {
    handleUpdateColor(ticket, type);
  };

  const handleDeleteSize = async size => {
    const confirmDelete = window.confirm('Bạn có chắc chắn muốn xóa màu này không?');
    if (!confirmDelete) {
      return;
    }

    deleteColorMutation.mutate(
      { id: size?._id },
      {
        onSuccess: () => {
          toast.showMessageSuccess('Xóa màu thành công');
          refetch?.();
        },
        onError: () => {
          toast.showMessageError('Xóa màu thất bại');
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
        cell: info => <Box>{info.renderValue()}</Box>,
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
    [colorsData]
  );

  const table = useReactTable({
    data: colorsData || [],
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

export default ColorTable;
