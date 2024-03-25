import { Button, Card, CardBody, CardHeader, Flex, FormControl, FormLabel, Input, Stack, Text, useColorModeValue, useDisclosure } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { CookieStorage } from 'utils/cookie-storage';
import { useHistory } from 'react-router-dom';
import Pagination from 'components/Pagination/Pagination';
import { useQueryGetListMember, useQueryGetListTransaction } from 'services/purchase-history';
import PurchaseHistoryTable from './components/Table';
import isEmpty from 'lodash/isEmpty';
import DatePicker from 'components/DatePicker/DatePicker';
import { Select } from 'chakra-react-select';
import { formatDate, getInitFilerChart } from 'utils/helpers';
import moment from 'moment';
import { mappingOptionSelect } from 'utils/mapping';
import { StatusPurchaseHistoryOptions } from 'constants/common';
import DetailOrderModal from './components/DetailOrderModal';

const initFiler = {
  endTime: getInitFilerChart().endDate,
  startTime: getInitFilerChart().startDate,
};

export const initialFilter = {
  pageSize: 10,
  pageIndex: 0,
  ...initFiler,
};

function PurchaseHistory() {
  const textColor = useColorModeValue('gray.700', 'white');
  const { isOpen, onOpen, onClose } = useDisclosure()
  const history = useHistory();
  const [searchTitle, setSearchTitle] = useState('');
  const [filter, setFilter] = useState(initialFilter);
  const [statisticFilter, setStatisticFilter] = useState({
    memberId: null,
    status: '',
    ...initFiler,
  });
  const [openMenuSelectMember, setOpenMenuSelectMember] = useState(false);
  const [transactionId, setTransactionId] = useState('');

  const handleSearch = () => {
    setFilter({
      ...filter,
      ...statisticFilter,
      memberId: statisticFilter?.memberId?.value,
      status: statisticFilter?.status?.value,
      searchKeyword: searchTitle,
    });
  };

  const onChangeDate = type => date => {
    setStatisticFilter(prev => ({
      ...prev,
      ...(type === 'startTime' && { endTime: new Date(formatDate(moment(date).add(6, 'days'))) }),
      [type]: date,
    }));
  };

  const onReset = () => {
    setFilter({
      ...initialFilter,
    });
    setStatisticFilter({
      ...initFiler,
    });
    setSearchTitle('')
  };

  useEffect(() => {
    if (!CookieStorage.isAuthenticated()) {
      return history.push('/auth/sign-in');
    }
  }, []);

  const { data: dataPurchase } = useQueryGetListTransaction({ ...filter }, { enabled: CookieStorage.isAuthenticated() });
  const { data: members } = useQueryGetListMember(
    {
      pageSize: 50,
      pageIndex: 0,
    },
    { enabled: openMenuSelectMember }
  );

  const handleSelectedRow = _id => {
    setTransactionId(_id)
    onOpen()
  }

  const handelCloseModal = () => {
    setTransactionId('')
    onClose()
  }

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
                  <Flex alignItems={'center'} gap={'14px'} flexWrap={'wrap'}>
                    <FormControl display="flex" flexDirection={'column'} width={{ base: 'full', sm: '300px' }}>
                      <FormLabel m="0">Ngày bắt đầu</FormLabel>
                      <DatePicker selectedDate={statisticFilter.startTime} onChange={date => onChangeDate('startTime')(date)} />
                    </FormControl>
                    <FormControl display="flex" flexDirection={'column'} width={{ base: 'full', sm: '300px' }}>
                      <FormLabel m="0">Ngày kết thúc</FormLabel>
                      <DatePicker
                        selectedDate={statisticFilter.endTime}
                        minDate={statisticFilter.startTime}
                        onChange={date => onChangeDate('endTime')(date)}
                      />
                    </FormControl>
                    <FormControl maxWidth={'300px'}>
                      <FormLabel>Thành viên</FormLabel>
                      <Select
                        onMenuOpen={() => setOpenMenuSelectMember(true)}
                        isClearable
                        menuShouldBlockScroll
                        value={statisticFilter?.memberId || null}
                        onChange={e => {
                          setStatisticFilter(prev => ({
                            ...prev,
                            memberId: e,
                          }));
                        }}
                        options={mappingOptionSelect(members?.data, 'fullname', '_id')}
                      ></Select>
                    </FormControl>
                    <FormControl maxWidth={'300px'}>
                      <FormLabel>Trạng thái</FormLabel>
                      <Select
                        isClearable
                        menuShouldBlockScroll
                        value={statisticFilter?.status || null}
                        onChange={e => {
                          setStatisticFilter(prev => ({
                            ...prev,
                            status: e,
                          }));
                        }}
                        options={StatusPurchaseHistoryOptions}
                      ></Select>
                    </FormControl>
                    <FormControl maxWidth={'300px'}>
                      <FormLabel>Tìm kiếm đơn hàng</FormLabel>
                      <Input value={searchTitle} onChange={e => setSearchTitle(e.target.value)} />
                    </FormControl>
                    <Button
                      variant="second"
                      border={'1px solid #4492E1'}
                      color={'blue.500'}
                      maxH="40px"
                      alignSelf={'end'}
                      onClick={onReset}
                    >
                      Reset
                    </Button>
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
            <PurchaseHistoryTable purchaseHistoryData={dataPurchase?.data || []} handleSelectedRow={handleSelectedRow} />
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
      {isOpen && transactionId && <DetailOrderModal isOpen={isOpen} transactionId={transactionId} onClose={handelCloseModal} />}
    </Flex>
  );
}

export default PurchaseHistory;
