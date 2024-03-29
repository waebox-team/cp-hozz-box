import { Box, Flex, IconButton, Table, Tbody, Td, Text, Th, Thead, Tr } from "@chakra-ui/react";
import { createColumnHelper, flexRender, getCoreRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { formatDate } from "utils/helpers";
import { MdRemoveShoppingCart } from "react-icons/md";
import { isEmpty } from "lodash";
import { useMutationCancelOrderByAdmin } from "services/order";
import { toast } from "components/Toast";

const OrderTable = ({ ordersData, refetch }) => {
  const columnHelper = createColumnHelper();
  const [sorting, setSorting] = useState([]);
  const cancelOrder = useMutationCancelOrderByAdmin()

  const convertOrderStatus = status => {
    switch (status) {
      case 'PROCESSING':
        return 'Đang xử lý'
      case 'APPROVED':
        return 'Xác nhận'
      default:
        return 'Từ chối';
    }
  }

  const handleRowClick = order => {
    const confirmDelete = window.confirm('Bạn có muốn hủy đơn hàng này không?');
    if (!confirmDelete) {
      return;
    }
    const payload = {
      orderId: order._id
    }
    cancelOrder.mutate(
      payload,
      {
        onSuccess: () => {
          toast.showMessageSuccess('Hủy đơn hàng thành công');
          refetch?.();
        },
        onError: () => {
          toast.showMessageError('Hủy đơn hàng thất bại');
          refetch?.();
        },
      }
    );
  }

  const columns = useMemo(
    () => [
      columnHelper.accessor('orderNo', {
        header: 'Mã đơn hàng',
        cell: info => info.getValue(),
      }),
      columnHelper.accessor('emailContact', {
        header: 'Email liên hệ',
        cell: info => info.getValue(),
      }),
      columnHelper.accessor('subTotal', {
        header: 'Giá đơn hàng',
        cell: info => info.getValue().toLocaleString('vi', { style: 'currency', currency: 'VND' }),
      }),
      columnHelper.accessor('shippingFee', {
        header: 'Phí vận chuyển',
        cell: info => info.getValue().toLocaleString('vi', { style: 'currency', currency: 'VND' }),
      }),
      columnHelper.accessor('totalPrice', {
        header: 'Tổng tiền',
        cell: info => info.getValue().toLocaleString('vi', { style: 'currency', currency: 'VND' }),
      }),
      columnHelper.accessor('status', {
        header: 'Trạng thái',
        cell: info => convertOrderStatus(info.getValue()),
      }),
      columnHelper.accessor('createdAt', {
        header: 'Ngày tạo',
        cell: info => <Text whiteSpace={'nowrap'}>{formatDate(info.row.original.created)}</Text>,
      }),
      columnHelper.accessor('action', {
        header: '',
        cell: info => (
          <Flex alignItems="center" gap={1}>
            <IconButton
              bg="transparent"
              onClick={() => {
                handleRowClick(info?.row?.original);
              }}
            >
              {info?.row?.original.status === 'PROCESSING' && <MdRemoveShoppingCart cursor="pointer" size={18} />}
            </IconButton>
          </Flex>
        ),
      }),
    ],
    [ordersData]
  );

  const table = useReactTable({
    data: ordersData || [],
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
  )
};

export default OrderTable;