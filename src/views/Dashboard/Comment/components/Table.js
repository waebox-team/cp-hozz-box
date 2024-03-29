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

const CommentTable = ({ comments, refetch }) => {
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
      columnHelper.accessor('images', {
        header: 'Ảnh',
        cell: info => (
          <Box minW="100px" minH="100px">
            <Image src={info.getValue()[0]?.includes('https') ? info.getValue() : ROOT_API + '/' + info.getValue()} boxSize="100px" />
          </Box>
        ),
      }),
      columnHelper.accessor('content', {
        header: 'Nội dung',
        cell: info => <Box minW="100px" maxW="250px">{info.renderValue()}</Box>,
      }),
      columnHelper.accessor('rate', {
        header: 'Đánh giá',
        cell: info => info.renderValue(),
      }),
      columnHelper.accessor('member.fullname', {
        header: 'Người bình luận',
        cell: info => info.getValue(),
      }),
      columnHelper.accessor('member.email', {
        header: 'Email',
        cell: info => info.renderValue(),
      }),
      columnHelper.accessor('product', {
        header: 'Sản phẩm',
        cell: info => <Box>{info.getValue()?.name}</Box>,
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
                handleDeleteComment(info?.row?.original);
              }}
            >
              <DeleteIcon color="red.400" boxSize={4} />
            </IconButton>
          </Flex>
        ),
      }),
    ],
    [comments]
  );

  const table = useReactTable({
    data: comments || [],
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

export default CommentTable;
