import { useRef, useState } from 'react';
import { Button, Flex, Stack, Text, useColorModeValue } from '@chakra-ui/react';
import { useHistory } from 'react-router-dom';
import isEmpty from 'lodash/isEmpty';
import Card from 'components/Card/Card';
import CardBody from 'components/Card/CardBody';
import CardHeader from 'components/Card/CardHeader';
import { importProduct, useExportTemplateProductMutation, useQueryGetProducts } from 'services/product';
import Pagination from 'components/Pagination/Pagination';
import ProductTable from './components/Table';
import { downloadFile } from 'utils/helpers';
import { toast } from 'components/Toast';
import { FileExcelValid } from 'constants/common';

export default function Product() {
  const history = useHistory();
  const inputImportRef = useRef();
  const textColor = useColorModeValue('gray.700', 'white');
  const [filter, setFilter] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const { data: productsData, refetch } = useQueryGetProducts(filter);
  const exportTemplateProductMutation = useExportTemplateProductMutation();

  const onDownloadTemplate = () => {
    exportTemplateProductMutation.mutate(undefined, {
      onSuccess: response => {
        downloadFile(response, 'product-template');
        toast.showMessageSuccess('Tải mẫu sản phẩm thành công');
      },
      onError: () => {
        toast.showMessageError('Tải mẫu sản phẩm thất bại');
      },
    });
  };

  const handleImportProduct = async e => {
    if (e?.target?.files?.[0]) {
      const productFile = e.target.files[0];
      const extensionFile = productFile?.name?.split('.')?.pop();

      if (FileExcelValid.includes(extensionFile)) {
        const formData = new FormData();

        formData.append('productFile', productFile);

        await importProduct(formData)
          .then(() => {
            toast.showMessageSuccess('Tải lên sản phẩm thành công');
            refetch();
          })
          .catch(() => {
            toast.showMessageError('Tải lên sản phẩm thất bại');
          });

        return;
      }

      setError('Chỉ hỗ trợ tải lại file định dạng .xlsx, xls');
    }
  };

  return (
    <>
      <Flex direction="column" pt={{ base: '120px', md: '75px', lg: '100px' }}>
        <Card p="16px" mb="24px" bg="#fff">
          <CardHeader p="12px 5px" mb="12px">
            <Flex justifyContent={'space-between'}>
              <Flex direction={'column'}>
                <Flex direction="column" gap={'30px'}>
                  <Text fontSize="xl" color={textColor} fontWeight="bold">
                    Sản phẩm
                  </Text>
                </Flex>
                {/* <Flex justifyContent={'space-between'} alignItems={'end'} gap={'20px'} mt={'20px'}>
                <Stack>
                  <Flex alignItems={'center'} gap={'20px'} flexWrap={{ base: 'wrap', md: 'nowrap' }}>
                    <FormControl minWidth={{ base: 'full', sm: '300px' }}>
                      <FormLabel>Loại ticket</FormLabel>
                      <Select
                        isClearable
                        menuShouldBlockScroll
                        onChange={e => {
                          setTicketType(e);
                        }}
                        options={TypeTicket}
                      ></Select>
                    </FormControl>
                    <FormControl>
                      <FormLabel>Đã phê duyệt</FormLabel>
                      <Switch
                        colorScheme="blue"
                        isChecked={switched}
                        onChange={event => {
                          setSwitched(event.target.checked);
                        }}
                      />
                    </FormControl>
                    <Button variant="primary" maxH="30px" onClick={onFilter} alignSelf={'end'}>
                      Lọc
                    </Button>
                  </Flex>
                </Stack>
              </Flex> */}
              </Flex>
              <Flex gap={2}>
                <Button bg="#3182ce" color="#fff" _hover={{ bg: '#67a1d7' }} isLoading={false} onClick={onDownloadTemplate}>
                  Tải template
                </Button>
                <Flex alignItems="center">
                  <input type="file" hidden ref={inputImportRef} onChange={handleImportProduct} />
                  <Button
                    bg="#3182ce"
                    color="#fff"
                    _hover={{ bg: '#67a1d7' }}
                    onClick={() => {
                      inputImportRef?.current?.click();
                    }}
                  >
                    Import sản phẩm
                  </Button>
                </Flex>
                <Button
                  bg="#3182ce"
                  color="#fff"
                  _hover={{ bg: '#67a1d7' }}
                  onClick={() => {
                    history.push('/admin/product/create');
                  }}
                >
                  <Text fontSize="md" fontWeight="bold" cursor="pointer">
                    Thêm
                  </Text>
                </Button>
              </Flex>
            </Flex>
          </CardHeader>
          <CardBody overflowX="auto">
            <Stack overflow={'auto'}>
              <ProductTable productsData={productsData?.data || []} refetch={refetch} />
            </Stack>
            <Flex justifyContent={'flex-end'}>
              {!isEmpty(productsData?.data) && (
                <Pagination
                  page={productsData?.pagination?.page}
                  pageLength={productsData?.pagination?.pageSize}
                  totalRecords={productsData?.pagination?.count}
                  onPageChange={(page, pageLength) => {
                    setFilter({
                      ...filter,
                      pageSize: pageLength,
                      pageIndex: page - 1,
                    });
                  }}
                />
              )}
            </Flex>
          </CardBody>
        </Card>
      </Flex>
      {/* {isCreateModalOpen && (
          <CreateSizeModal sizeDetail={sizeEditing} isOpen={isCreateModalOpen} onClose={handelCloseModal} refetch={refetch} />
        )} */}
    </>
  );
}
