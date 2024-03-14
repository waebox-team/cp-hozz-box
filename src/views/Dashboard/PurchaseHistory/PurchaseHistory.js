import { Button, Card, CardBody, CardHeader, Flex, FormControl, FormLabel, Input, Stack, Text, useColorModeValue } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { CookieStorage } from 'utils/cookie-storage';
import { useHistory } from 'react-router-dom';
import Pagination from 'components/Pagination/Pagination';
import { useQueryGetListTransaction } from 'services/purchase-history';
import PurchaseHistoryTable from './components/Table';
import isEmpty from 'lodash/isEmpty';

function PurchaseHistory() {
  const textColor = useColorModeValue('gray.700', 'white');
  const history = useHistory();
  const [searchTitle, setSearchTitle] = useState('');
  const [filter, setFilter] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const handleSearch = () => {
    setFilter({
      ...filter,
      searchKeyword: searchTitle,
    });
  };

  useEffect(() => {
    if (!CookieStorage.isAuthenticated()) {
      return history.push('/auth/sign-in');
    }
  }, []);

  const { data: dataPurchase } = useQueryGetListTransaction({ ...filter }, { enabled: CookieStorage.isAuthenticated() });

  return (
    <Flex direction="column" pt={{ base: '120px', md: '75px', lg: '100px' }}>
      <Card p="16px" mb="24px" bg="#fff">
        <CardHeader p="12px 5px" mb="12px">
          <Flex justifyContent={'space-between'}>
            <Flex direction={'column'}>
              <Flex direction="column" gap={'30px'}>
                <Text fontSize="xl" color={textColor} fontWeight="bold">
                  Lịch sử mua hàng
                </Text>
              </Flex>
              <Flex justifyContent={'space-between'} alignItems={'end'} gap={'20px'} mt={'20px'}>
                <Stack>
                  <Flex alignItems={'center'} gap={'20px'} flexWrap={{ base: 'wrap', md: 'nowrap' }}>
                    <FormControl minWidth={{ base: 'full', sm: '300px' }}>
                      <FormLabel>Tìm kiếm đơn hàng</FormLabel>
                      <Input value={searchTitle} onChange={e => setSearchTitle(e.target.value)} />
                    </FormControl>
                    <Button variant="primary" maxH="40px" alignSelf={'end'} onClick={handleSearch}>
                      <Text fontSize="md" fontWeight="bold" cursor="pointer">
                        Tìm kiếm
                      </Text>
                    </Button>
                  </Flex>
                </Stack>
              </Flex>
            </Flex>
          </Flex>
        </CardHeader>
        <CardBody overflowX="auto">
          <Stack overflow={'auto'}>
            <PurchaseHistoryTable purchaseHistoryData={dataPurchase?.data || []} />
          </Stack>
          {!isEmpty(dataPurchase?.data) && (
            <Flex justifyContent={'flex-end'}>
              <Pagination
                page={dataPurchase?.pagination?.page}
                pageLength={dataPurchase?.pagination?.pageSize}
                totalRecords={dataPurchase?.pagination?.count}
                onPageChange={(page, pageLength) => {
                  setFilter({
                    ...filter,
                    pageSize: pageLength,
                    pageIndex: page - 1,
                  });
                }}
              />
            </Flex>
          )}
        </CardBody>
      </Card>
    </Flex>
  );
}

export default PurchaseHistory;
