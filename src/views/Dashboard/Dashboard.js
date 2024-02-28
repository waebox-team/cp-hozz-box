import React, { useEffect, useState } from 'react';
import useAxios from 'axios-hooks';
import { Flex, Grid, SimpleGrid, Stat, StatLabel, StatNumber, Text, useColorModeValue } from '@chakra-ui/react';
import Card from 'components/Card/Card.js';
import { useHistory } from 'react-router-dom';
import { formatDate } from 'utils/helpers';
import DailyChart from 'components/DailyChart/DailyChart';
import { getInitFilerChart } from 'utils/helpers';
import { PersonIcon } from 'components/Icons/Icons';
import IconBox from 'components/Icons/IconBox';
import { EmailIcon, ViewIcon } from '@chakra-ui/icons';
import { CookieStorage } from 'utils/cookie-storage';

const initFiler = getInitFilerChart();

export default function Dashboard() {
  const iconBlue = useColorModeValue('blue.500', 'blue.500');
  const iconBoxInside = useColorModeValue('white', 'white');
  const textColor = useColorModeValue('gray.700', 'white');
  const isLoggedIn = CookieStorage.isAuthenticated();
  const history = useHistory();

  // const [{ data: statisticalData }, getStatistical] = useAxios(
  //   {
  //     url: API_ROUTES.EmailDaily,
  //   },
  //   { manual: true }
  // );
  // const [{ data: emailOpened }, getEmailOpened] = useAxios(
  //   {
  //     url: API_ROUTES.EmailOpenedDaily,
  //   },
  //   { manual: true }
  // );
  // const [{ data: overviewCampaignData }, getOverviewCampaign] = useAxios(
  //   {
  //     url: API_ROUTES.OverviewCampaign,
  //   },
  //   {
  //     useCache: false,
  //   }
  // );

  // useEffect(() => {
  //   getStatistical({
  //     params: {
  //       startDate: formatDate(initFiler.startDate, 'YYYY-MM-DD'),
  //       endDate: formatDate(initFiler.endDate, 'YYYY-MM-DD'),
  //     },
  //   });
  //   getEmailOpened({
  //     params: {
  //       startDate: formatDate(initFiler.startDate, 'YYYY-MM-DD'),
  //       endDate: formatDate(initFiler.endDate, 'YYYY-MM-DD'),
  //     },
  //   });
  // }, []);

  useEffect(() => {
    if (!isLoggedIn) {
      return history.push('/auth/sign-in');
    }
  }, [isLoggedIn, history]);

  const handleGetNewData = (startDate, endDate) => {
    getStatistical({
      params: {
        startDate: formatDate(startDate, 'YYYY-MM-DD'),
        endDate: formatDate(endDate, 'YYYY-MM-DD'),
      },
    });
  };

  const handleFilterEmailOpened = (startDate, endDate) => {
    getEmailOpened({
      params: {
        startDate: formatDate(startDate, 'YYYY-MM-DD'),
        endDate: formatDate(endDate, 'YYYY-MM-DD'),
      },
    });
  };

  const onClickChart = (startDate, endDate) => {
    history.push({
      pathname: '/admin/email',
      search: `?startDate=${formatDate(startDate, 'YYYY-MM-DD')}&endDate=${formatDate(endDate, 'YYYY-MM-DD')}&isOpen=true`,
    });
  };

  return (
    <>
      <Flex flexDirection="column" pt={{ base: '120px', md: '75px' }}>
        <SimpleGrid columns={{ sm: 1, md: 3, xl: 3 }} spacing="24px" mb="20px">
          <Card minH="125px" bgColor="white">
            <Flex direction="column">
              <Flex flexDirection="row" align="center" justify="center" w="100%" mb="25px">
                <Stat me="auto">
                  <StatLabel fontSize="xs" color="gray.400" fontWeight="bold" textTransform="uppercase">
                    Tổng liên hệ
                  </StatLabel>
                  <Flex>
                    <StatNumber fontSize="lg" color={textColor} fontWeight="bold">
                      {0}
                    </StatNumber>
                  </Flex>
                </Stat>
                <IconBox borderRadius="50%" as="box" h={'45px'} w={'45px'} bg={iconBlue}>
                  <PersonIcon h={'24px'} w={'24px'} color={iconBoxInside} />
                </IconBox>
              </Flex>
              <Text color="gray.400" fontSize="sm">
                <Text
                  as="span"
                  cursor="pointer"
                  color="blue.400"
                  textDecoration="underline"
                  _hover={{ textDecoration: 'none', opacity: '.7' }}
                  onClick={() => {
                    history.push('/admin/campaign');
                  }}
                >
                  Chi tiết
                </Text>
              </Text>
            </Flex>
          </Card>
          <Card minH="125px" bgColor="white">
            <Flex direction="column">
              <Flex flexDirection="row" align="center" justify="center" w="100%" mb="25px">
                <Stat me="auto">
                  <StatLabel fontSize="xs" color="gray.400" fontWeight="bold" textTransform="uppercase">
                    Tổng mail đã gửi thành công
                  </StatLabel>
                  <Flex>
                    <StatNumber fontSize="lg" color={textColor} fontWeight="bold">
                      {0}
                    </StatNumber>
                  </Flex>
                </Stat>
                <IconBox borderRadius="50%" as="box" h={'45px'} w={'45px'} bg={iconBlue}>
                  <EmailIcon h={'24px'} w={'24px'} color={iconBoxInside} />
                </IconBox>
              </Flex>
              <Text color="gray.400" fontSize="sm">
                <Text as="span" color="green.400" fontWeight="bold">
                  {0}%
                </Text>
              </Text>
            </Flex>
          </Card>
          <Card minH="125px" bgColor="white">
            <Flex direction="column">
              <Flex flexDirection="row" align="center" justify="center" w="100%" mb="25px">
                <Stat me="auto">
                  <StatLabel fontSize="xs" color="gray.400" fontWeight="bold" textTransform="uppercase">
                    Tổng mail đã mở
                  </StatLabel>
                  <Flex>
                    <StatNumber fontSize="lg" color={textColor} fontWeight="bold">
                      {0}
                    </StatNumber>
                  </Flex>
                </Stat>
                <IconBox borderRadius="50%" as="box" h={'45px'} w={'45px'} bg={iconBlue}>
                  <ViewIcon h={'24px'} w={'24px'} color={iconBoxInside} />
                </IconBox>
              </Flex>
              <Text color="gray.400" fontSize="sm">
                <Text as="span" color="green.400" fontWeight="bold">
                  {0}%
                </Text>
              </Text>
            </Flex>
          </Card>
        </SimpleGrid>
        {/* <Grid templateColumns={{ sm: '1fr' }} templateRows={{ lg: 'repeat(2, auto)' }} gap="20px">
          <Card p="0px" maxW={{ sm: '320px', md: '100%' }}>
            <DailyChart
              title={`Thống kê Email đã gửi`}
              labelChart="Email đã gửi"
              dataChart={statisticalData?.data || []}
              getNewData={handleGetNewData}
            />
          </Card>
          <Card p="0px" maxW={{ sm: '320px', md: '100%' }}>
            <DailyChart
              title={`Thống kê Email đã đọc`}
              labelChart="Email đã đọc"
              dataChart={emailOpened?.data || []}
              getNewData={handleFilterEmailOpened}
              onClickChart={onClickChart}
            />
          </Card>
        </Grid> */}
      </Flex>
    </>
  );
}
