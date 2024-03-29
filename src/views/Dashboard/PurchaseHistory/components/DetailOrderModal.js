import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Table,
  Thead,
  Tr,
  Th,
  Box,
  Tbody,
  Td,
} from '@chakra-ui/react'
import { createColumnHelper, flexRender, getCoreRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import { isEmpty } from 'lodash';
import { useMemo } from 'react';
import { useQueryGetOrderByTransaction } from 'services/purchase-history';

const DetailOrderModal = (props) => {
  const { isOpen, onClose, transactionId } = props;
  const columnHelper = createColumnHelper();
  const { data: orders } = useQueryGetOrderByTransaction(transactionId, { enabled: transactionId ? true : false })

  const columns = useMemo(
    () => [
      columnHelper.accessor('product', {
        header: 'Tên sản phẩm',
        cell: info => info.getValue(),
      }),
      columnHelper.accessor('quantity', {
        header: 'Số lượng',
        cell: info => info.getValue(),
      }),
      columnHelper.accessor('color', {
        header: 'Màu',
        cell: info => info.getValue(),
      }),
      columnHelper.accessor('size', {
        header: 'Size',
        cell: info => info.getValue(),
      }),
      columnHelper.accessor('price', {
        header: 'Giá',
        cell: info => info.getValue().toLocaleString('vi', { style: 'currency', currency: 'VND' }),
      }),
      columnHelper.accessor('sale', {
        header: 'Khuyến mãi',
        cell: info => <Box>{`${info.getValue()} %`}</Box>,
      }),
      columnHelper.accessor('finalPrice', {
        header: 'Tổng tiền',
        cell: info => info.getValue().toLocaleString('vi', { style: 'currency', currency: 'VND' }),
      }),
    ],
    [orders]
  );

  const table = useReactTable({
    data: orders?.data?.cartId?.products || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    debugTable: true,
  });

  return (
    <Modal onClose={onClose} isOpen={isOpen}>
      <ModalOverlay />
      <ModalContent minW={700}>
        <ModalHeader>Danh sách sản phẩm của đơn</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Table>
            <Thead>
              {table.getHeaderGroups().map(headerGroup => (
                <Tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <Th key={header.id} w="120px" fontSize={"12"} fontWeight={700}>
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
                      <Td fontSize={"12"} fontWeight={600} key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</Td>
                    ))}
                  </Tr>
                ))
              )}
            </Tbody>
          </Table>
        </ModalBody>
        <ModalFooter>
          <Button onClick={onClose}>Đóng</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
};

export default DetailOrderModal;