import { Box, Flex, IconButton, Image, Switch, Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import { flexRender, getCoreRowModel, getSortedRowModel, useReactTable, createColumnHelper } from '@tanstack/react-table';
import { useMemo, useState } from 'react';
import { DeleteIcon, EditIcon } from '@chakra-ui/icons';
import isEmpty from 'lodash/isEmpty';
import { useHistory } from 'react-router-dom';
import { formatDate } from 'utils/helpers';
import { ROOT_API } from 'constants/common';
import { toast } from 'components/Toast';
import {
  useChangeStatusProductMutation,
  useDeleteProductMutation,
  useSetHotProductMutation,
  useSetNewProductMutation,
} from 'services/product';

const ProductTable = ({ productsData, refetch }) => {
  const history = useHistory();
  const [sorting, setSorting] = useState([]);
  const columnHelper = createColumnHelper();

  const deleteProductMutation = useDeleteProductMutation();
  const changeStatusProductMutation = useChangeStatusProductMutation();
  const setNewProductMutation = useSetNewProductMutation();
  const setHotProductMutation = useSetHotProductMutation();

  const handleDeleteSize = product => {
    const confirmDelete = window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này không?');
    if (!confirmDelete) {
      return;
    }

    deleteProductMutation.mutate(
      { id: product?._id },
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

  const onActionProduct = (productId, title, actionApi) => {
    actionApi.mutate(
      { id: productId },
      {
        onSuccess: () => {
          toast.showMessageSuccess(`${title} thành công`);
          refetch?.();
        },
        onError: () => {
          toast.showMessageError(`${title} thất bại`);
          refetch?.();
        },
      }
    );
  };

  const columns = useMemo(
    () => [
      columnHelper.accessor('thumbnails', {
        header: 'Ảnh',
        cell: info => (
          <Box minW="100px" minH="100px">
            <Image src={info.getValue()[0]?.includes('https') ? info.getValue()[0] : ROOT_API + '/' + info.getValue()[0]} boxSize="100px" />
          </Box>
        ),
      }),
      columnHelper.accessor('name', {
        header: 'Tên',
        cell: info => <Box textTransform="uppercase">{info.renderValue()}</Box>,
      }),
      columnHelper.accessor('price', {
        header: 'Giá',
        cell: info => info.renderValue(),
      }),
      columnHelper.accessor('sale', {
        header: 'Giá khuyến mãi',
        cell: info => info.renderValue(),
      }),
      columnHelper.accessor('categoryId', {
        header: 'Danh mục',
        cell: info => <Box>{info.getValue().title}</Box>,
      }),
      columnHelper.accessor('isPublished', {
        header: 'Phát hành',
        cell: info => (
          <Switch
            size="md"
            isChecked={info.getValue()}
            onChange={e => onActionProduct(info?.row?.original?._id, 'Phát hành sản phẩm', changeStatusProductMutation)}
          />
        ),
      }),
      columnHelper.accessor('isNew', {
        header: 'Mới',
        cell: info => (
          <Switch
            size="md"
            isChecked={info.getValue()}
            onChange={e => onActionProduct(info?.row?.original?._id, 'Thiết lập sản phẩm mới', setNewProductMutation)}
          />
        ),
      }),
      columnHelper.accessor('isBest', {
        header: 'Nổi bật',
        cell: info => (
          <Switch
            size="md"
            isChecked={info.getValue()}
            onChange={e => onActionProduct(info?.row?.original?._id, 'Thiết lập sản phẩm nổi bật', setHotProductMutation)}
          />
        ),
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
                history.push(`/admin/product/${info?.row?.original?._id}`);
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
    [productsData]
  );

  const table = useReactTable({
    data: productsData || [],
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

export default ProductTable;
