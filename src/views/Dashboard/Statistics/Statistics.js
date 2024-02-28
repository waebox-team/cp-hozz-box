import React, { useEffect, useState } from 'react';
import { Button, Center, Flex, FormControl, FormLabel, Stack, Text, useColorModeValue } from '@chakra-ui/react';
import Card from 'components/Card/Card';
import CardBody from 'components/Card/CardBody';
import CardHeader from 'components/Card/CardHeader';
import Pagination from 'components/Pagination/Pagination';
import { Select } from 'chakra-react-select';
import { GROUP_BY_WEBSITE_ADS, GroupByOptions, TypeTicket } from 'constants/common';
import { useQueryGetStatisticsWebsite } from 'services/statistics';
import DatePicker from 'components/DatePicker/DatePicker';
import { formatDate, getInitFilerChart } from 'utils/helpers';
import moment from 'moment';
import isEmpty from 'lodash/isEmpty';
import StatisticsTable from './components/Table';
import { useQueryGetMyWebsiteAdUnits, useQueryGetMyWebsites } from 'services/website';
import { mappingOptionSelect } from 'utils/mapping';
import { useQueryGetCountry } from 'services/campaign';
import { CookieStorage } from 'utils/cookie-storage';
import { useHistory } from 'react-router-dom';

const initFiler = getInitFilerChart();

export const initialFilter = {
  pageSize: 10,
  pageIndex: 0,
  ...initFiler,
};

function Statistics() {
  const isLoggedIn = CookieStorage.isAuthenticated();
  const history = useHistory();
  const textColor = useColorModeValue('gray.700', 'white');
  const [filter, setFilter] = useState({ ...initialFilter });
  const [statisticFilter, setStatisticFilter] = useState({
    domain: null,
    country: null,
    placement: null,
  });
  const [tab, setTab] = useState(GROUP_BY_WEBSITE_ADS.DATE);
  const [websiteId, setWebsiteId] = useState(null);

  useEffect(() => {
    if (!isLoggedIn) {
      return history.push('/auth/sign-in');
    }
  }, [isLoggedIn, history]);

  const { data: myWebsites } = useQueryGetMyWebsites({}, { enabled: isLoggedIn });
  const { data: country } = useQueryGetCountry({}, { enabled: isLoggedIn });
  const { data: myWebsiteAdunit } = useQueryGetMyWebsiteAdUnits(
    websiteId,
    {
      pageSize: 10,
      pageIndex: 0,
    },
    { enabled: !!websiteId && isLoggedIn }
  );
  const { data } = useQueryGetStatisticsWebsite(
    {
      ...filter,
      ...(tab && { groupBy: tab }),
    },
    { enabled: isLoggedIn }
  );

  const onReset = () => {
    setFilter({
      ...initialFilter,
    });
    setStatisticFilter({
      domain: null,
      country: null,
      placement: null,
    });
  };

  const onFilter = () => {
    setFilter({
      ...filter,
      ...statisticFilter,
      ...(!!statisticFilter?.domain && { domain: statisticFilter?.domain?.value }),
      ...(!!statisticFilter?.country && { country: statisticFilter?.country?.value }),
      ...(!!statisticFilter?.placement && { placement: statisticFilter?.placement?.value }),
    });
  };

  const onChangeDate = type => date => {
    setFilter(prev => ({
      ...prev,
      ...(type === 'startDate' && { endDate: new Date(formatDate(moment(date).add(6, 'days'))) }),
      [type]: date,
    }));
  };
  return (
    <Flex direction="column" pt={{ base: '120px', md: '75px', lg: '100px' }}>
      <Card p="16px" mb="24px" bg="#fff">
        <CardHeader p="12px 5px" mb="20px">
          <Flex justifyContent={'space-between'}>
            <Flex direction={'column'}>
              <Flex direction="column" gap={'30px'}>
                <Text fontSize="xl" color={textColor} fontWeight="bold">
                  Statistics
                </Text>
              </Flex>
              <Flex justifyContent={'space-between'} alignItems={'end'} gap={'20px'} mt={'30px'}>
                <Stack>
                  <Flex alignItems={'center'} gap={'20px'} flexWrap={{ base: 'wrap', lg: 'nowrap' }}>
                    <FormControl minWidth={{ base: 'full', sm: '300px' }}>
                      <FormLabel>Country</FormLabel>
                      <Select
                        isClearable
                        menuShouldBlockScroll
                        value={statisticFilter?.country || null}
                        onChange={e => {
                          setStatisticFilter(prev => ({
                            ...prev,
                            country: e,
                          }));
                        }}
                        options={mappingOptionSelect(country?.data, 'name', 'code')}
                      ></Select>
                    </FormControl>
                    <FormControl minWidth={{ base: 'full', sm: '300px' }}>
                      <FormLabel>Domain</FormLabel>
                      <Select
                        isClearable
                        menuShouldBlockScroll
                        value={statisticFilter?.domain || null}
                        onChange={e => {
                          setStatisticFilter(prev => ({
                            ...prev,
                            domain: e,
                          }));
                          setWebsiteId(e?.value);
                        }}
                        options={mappingOptionSelect(myWebsites?.data)}
                      ></Select>
                    </FormControl>
                    <FormControl minWidth={{ base: 'full', sm: '300px' }}>
                      <FormLabel>Placement</FormLabel>
                      <Select
                        isDisabled={!websiteId}
                        isClearable
                        menuShouldBlockScroll
                        value={statisticFilter?.placement || null}
                        onChange={e => {
                          setStatisticFilter(prev => ({
                            ...prev,
                            placement: e,
                          }));
                        }}
                        options={mappingOptionSelect(myWebsiteAdunit?.data)}
                      ></Select>
                    </FormControl>
                  </Flex>
                  <Flex flexWrap="wrap" marginTop={4} gap={'20px'}>
                    <FormControl display="flex" flexDirection={'column'} width={{ base: 'full', sm: '300px' }}>
                      <FormLabel m="0">Start date</FormLabel>
                      <DatePicker selectedDate={filter.startDate} onChange={date => onChangeDate('startDate')(date)} />
                    </FormControl>
                    <FormControl display="flex" flexDirection={'column'} width={{ base: 'full', sm: '300px' }}>
                      <FormLabel m="0">End date</FormLabel>
                      <DatePicker
                        selectedDate={filter.endDate}
                        minDate={filter.startDate}
                        onChange={date => onChangeDate('endDate')(date)}
                      />
                    </FormControl>
                    <Button
                      variant="second"
                      border={'1px solid #4492E1'}
                      color={'blue.500'}
                      maxH="30px"
                      alignSelf={'end'}
                      onClick={onReset}
                    >
                      Reset
                    </Button>
                    <Button variant="primary" maxH="30px" px={8} fontSize={14} alignSelf={'end'} onClick={onFilter}>
                      Filter
                    </Button>
                  </Flex>
                  <Flex alignItems={'center'} justifyContent={'space-between'} mt={4} flexWrap={{ base: 'wrap', lg: 'nowrap' }}>
                    <Text>Group by:</Text>
                    <Flex
                      fontSize={13}
                      color="#747474"
                      fontWeight={500}
                      bg={'white'}
                      border={'1px solid #ccc'}
                      rounded={6}
                      overflow={'hidden'}
                      mt={4}
                    >
                      {GroupByOptions.map((item, index) => (
                        <Center
                          key={index}
                          px={4}
                          py={2}
                          bg={item.value === tab ? 'blue.100' : 'white'}
                          color={item.value === tab ? 'blue.500' : '#747474'}
                          cursor={'pointer'}
                          onClick={() => setTab(item.value)}
                        >
                          <Text>{item.label}</Text>
                        </Center>
                      ))}
                    </Flex>
                  </Flex>
                </Stack>
              </Flex>
            </Flex>
          </Flex>
        </CardHeader>
        <CardBody>
          <Stack overflow={'auto'} mt={4}>
            <StatisticsTable data={data?.data || []} title={tab} />
          </Stack>
          {!isEmpty(data?.data) && (
            <Flex justifyContent={'flex-end'}>
              <Pagination
                page={data?.pagination?.page}
                pageLength={data?.pagination?.pageSize}
                totalRecords={data?.pagination?.count}
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

export default Statistics;
