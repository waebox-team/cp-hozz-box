import { useMemo, useState } from 'react';
import { Button, Flex, Stack, Text, useColorModeValue, useDisclosure } from '@chakra-ui/react';
import { useHistory } from 'react-router-dom';
import Card from 'components/Card/Card';
import CardBody from 'components/Card/CardBody';
import CardHeader from 'components/Card/CardHeader';
import { useQueryGetProducts } from 'services/product';
import Pagination from 'components/Pagination/Pagination';
import ProductTable from './components/Table';

export default function Product() {
  const history = useHistory();
  const textColor = useColorModeValue('gray.700', 'white');
  const [filter, setFilter] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const { data: productsData, refetch } = useQueryGetProducts(filter);
  console.log('🚀 ~ Product ~ productsData:', productsData);

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
          </CardHeader>
          <CardBody overflowX="auto">
            <Stack overflow={'auto'}>
              <ProductTable productsData={productsData?.data || []} refetch={refetch} />
            </Stack>
            <Flex justifyContent={'flex-end'}>
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
