import { Card, CardBody, Flex, Stack } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { CookieStorage } from 'utils/cookie-storage';
import { useHistory } from 'react-router-dom';
import Pagination from 'components/Pagination/Pagination';
import { useQueryGetListTransaction } from 'services/purchase-history';
import PurchaseHistoryTable from './components/Table';

function PurchaseHistory() {
  const history = useHistory();
  const [filter, setFilter] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  useEffect(() => {
    if (!CookieStorage.isAuthenticated()) {
      return history.push('/auth/sign-in');
    }
  }, []);

  const { data: dataPurchase } = useQueryGetListTransaction({ ...filter }, { enabled: CookieStorage.isAuthenticated() });

  return (
    <Flex direction="column" pt={{ base: '120px', md: '75px', lg: '100px' }}>
      <Card p="16px" mb="24px" bg="#fff">
        <CardBody overflowX="auto">
          <Stack overflow={'auto'}>
            <PurchaseHistoryTable purchaseHistoryData={dataPurchase?.data || []} />
          </Stack>
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
        </CardBody>
      </Card>
    </Flex>
  );
}

export default PurchaseHistory;
