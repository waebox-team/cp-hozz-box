import { Box, Flex, IconButton, Table, Tbody, Td, Text, Th, Thead, Tr } from '@chakra-ui/react';
import { flexRender, getCoreRowModel, getSortedRowModel, useReactTable, createColumnHelper } from '@tanstack/react-table';
import { useMemo, useState } from 'react';
import isEmpty from 'lodash/isEmpty';
import { formatDate } from 'utils/helpers';

// icon
import { FiLock, FiUnlock } from "react-icons/fi";
import { LuUserCheck, LuUserX } from "react-icons/lu";
import { useChangeStatusMutation } from 'services/purchase-history';
import { toast } from 'components/Toast';

const SizeTable = ({ membersData, refetch }) => {
  const [sorting, setSorting] = useState([]);
  const columnHelper = createColumnHelper();
  const changeStatus = useChangeStatusMutation();

  const handleRowClick = (member, type) => {
    const payload = {
      "email": member.email,
      "action": type,
      "status": true
    }
    const mess = type === "BOLCK" ? "Khóa tài khoản" : "Kích hoạt tài khoản" 
    const confirmDelete = window.confirm(`Bạn có chắc chắn muốn ${mess} tài khoản này không?`);
    if (!confirmDelete) {
      return;
    }

    
    changeStatus.mutate(
      payload,
      {
        onSuccess: () => {
          toast.showMessageSuccess(`${mess} thành công`);
          refetch?.();
        },
        onError: err => {
          // console.log(err, '----')
          // toast.showMessageError(`${mess} thất bại`);
          refetch?.();
        },
      }
    );
  };

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

      // columnHelper.accessor('gender', {
      //   header: 'Giới tính',
      //   cell: info => info.getValue(),
      // }),

      columnHelper.accessor('balance', {
        header: 'Số dư',
        cell: info => info.getValue(),
      }),

      columnHelper.accessor('createdAt', {
        header: 'Ngày tạo',
        cell: info => <Text whiteSpace={'nowrap'}>{formatDate(info.row.original.created)}</Text>,
      }),

      columnHelper.accessor('isActived', {
        header: 'Trạng thái kích hoạt',
        cell: info => info.getValue() ? "Kích hoạt" : "Chưa kích hoạt",
      }),

      columnHelper.accessor('isBlocked', {
        header: 'Trạng thái hoạt động',
        cell: info => !info.getValue() ? "Hoạt động" : "Đã khóa",
      }),
      columnHelper.accessor('action', {
        header: '',
        cell: info => (
          <Flex alignItems="center" gap={1}>
            <IconButton
              bg="transparent"
              onClick={() => {
                handleRowClick(info?.row?.original, "ACTIVE", !info?.row?.original.isActived);
              }}
            >
              {!info?.row?.original.isActived ? <LuUserX cursor="pointer" size={18} /> : <LuUserCheck cursor="pointer" size={18} />}
            </IconButton>
            <IconButton
              bg="transparent"
              onClick={() => {
                handleRowClick(info?.row?.original, "BLOCK", !info?.row?.original.isBLocked);
              }}
            >
              {!info?.row?.original.isBlocked ? <FiLock cursor="pointer" size={18} /> : <FiUnlock cursor="pointer" size={18} />}
            </IconButton>
          </Flex>
        ),
      }),
    ],
    [membersData]
  );

  const table = useReactTable({
    data: membersData || [],
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
