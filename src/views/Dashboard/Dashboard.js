import React, { useEffect, useState } from 'react';
import { Box, Center, Flex, FormControl, FormLabel, SimpleGrid, Text, useColorModeValue } from '@chakra-ui/react';
import Card from 'components/Card/Card.js';
import { useHistory } from 'react-router-dom';
import IconBox from 'components/Icons/IconBox';
import DatePicker from 'components/DatePicker/DatePicker';
import { CookieStorage } from 'utils/cookie-storage';
import { BiSolidFilm } from "react-icons/bi";
import { GiMoneyStack } from "react-icons/gi";
import { formatDate, getInitFilerChart } from 'utils/helpers';
import { useQueryGetStatistics } from 'services/statistic';
import { MdOutlinePayments } from "react-icons/md";
import moment from 'moment';

const initFiler = {
  endTime: getInitFilerChart().endDate,
  startTime: getInitFilerChart().startDate,
};

export default function Dashboard() {
  const textColor = useColorModeValue('gray.700', 'white');
  const isLoggedIn = CookieStorage.isAuthenticated();
  const history = useHistory();
  const sidebarBg = 'hsl(208.33deg 100% 96.31% / 80%)';
  const [statisticFilter, setStatisticFilter] = useState(initFiler);
  const { data: statistic } = useQueryGetStatistics(statisticFilter, { enabled: isLoggedIn ? true : false });

  // useEffect(() => {
  //   if (!CookieStorage.isAuthenticated()) {
  //     return history.push('/auth/sign-in');
  //   }
  // }, []);

  useEffect(() => {
    if (!isLoggedIn) {
      return history.push('/auth/sign-in');
    }
  }, [isLoggedIn, history]);

  const onChangeDate = type => date => {
    setStatisticFilter(prev => ({
      ...prev,
      ...(type === 'startTime' && { endTime: new Date(formatDate(moment(date).add(6, 'days'))) }),
      [type]: date,
    }));
  };

  return (
    <>
      <Flex flexDirection="column" pt={{ base: '120px', md: '75px' }}>
        <Box display={{ sm: 'none', xl: 'block' }}>
          <Box
            backdropFilter="blur(21px)"
            boxShadow="0px 2px 5.5px rgba(0, 0, 0, 0.02)"
            bg={sidebarBg}
            borderRadius={"10px"}
            py={"32px"}
            px={"16px"}
          >
            <Card borderRadius="8px" bgColor="white">
              <Text fontSize="xl" color={textColor} fontWeight="bold">
                Lịch sử mua hàng
              </Text>
            </Card>
            <SimpleGrid columns={{ sm: 1, md: 3, xl: 3 }} spacing="24px" mb="20px" mt="20px">
              <StatisticalData
                title="Tổng số người dùng"
                value={statistic?.data?.memeber || 0}
                icon={
                  <IconBox borderRadius="50%" as="box" h={'45px'} w={'45px'} mr={"16px"}>
                    <BiSolidFilm size={"45"} />
                  </IconBox>
                }
              />
              <StatisticalData
                title="Tổng số sản phẩm"
                value={statistic?.data?.product || 0}
                icon={
                  <IconBox borderRadius="50%" as="box" h={'45px'} w={'45px'} mr={"16px"}>
                    <BiSolidFilm size={"45"} />
                  </IconBox>
                }
              />
              <StatisticalData
                title="Tổng số comment"
                value={statistic?.data?.count_comment || 0}
                icon={
                  <IconBox borderRadius="50%" as="box" h={'45px'} w={'45px'} mr={"16px"}>
                    <BiSolidFilm size={"45"} />
                  </IconBox>
                }
              />
            </SimpleGrid>
            <Text fontSize="xl" color={textColor} fontWeight="bold" mb="20px">
              Tổng các giao dịch
            </Text>
            <Card borderRadius="8px" bgColor="white">
              <Flex>
                <FormControl display="flex" flexDirection={'column'} width={{ base: 'full', sm: '300px' }}>
                  <FormLabel m="0" fontWeight={"600"}>Ngày bắt đầu</FormLabel>
                  <DatePicker selectedDate={statisticFilter.startTime} onChange={date => onChangeDate('startTime')(date)} />
                </FormControl>
                <FormControl display="flex" flexDirection={'column'} width={{ base: 'full', sm: '300px' }} ml="16px">
                  <FormLabel m="0" fontWeight={"600"}>Ngày kết thúc</FormLabel>
                  <DatePicker
                    selectedDate={statisticFilter.endTime}
                    minDate={statisticFilter.startTime}
                    onChange={date => onChangeDate('endTime')(date)}
                  />
                </FormControl>
              </Flex>
              <SimpleGrid columns={{ sm: 1, md: 3, xl: 3 }} spacing="24px" mb="20px" mt="20px">
                <StatisticalTracsaction
                  title="Thành công"
                  data={{
                    'total': statistic?.data?.transaction?.success?.total || 0,
                    'amount': statistic?.data?.transaction?.success?.total_amount || 0
                  }}
                />
                <StatisticalTracsaction
                  title="Đang chờ"
                  data={{
                    'total': statistic?.data?.transaction?.open?.total || 0,
                    'amount': statistic?.data?.transaction?.open?.total_amount || 0
                  }}
                />
                <StatisticalTracsaction
                  title="Không thành công"
                  data={{
                    'total': statistic?.data?.transaction?.unpaid?.total || 0,
                    'amount': statistic?.data?.transaction?.unpaid?.total_amount || 0
                  }}
                />
              </SimpleGrid>
            </Card>
          </Box>
        </Box>
      </Flex>
    </>
  );
}

const StatisticalData = (props) => {
  const { title, value, icon } = props;
  const textColor = useColorModeValue('gray.700', 'white');

  return (
    <Card minH="125px" bgColor="white" borderRadius="8px">
      <Text fontSize="xl" color={textColor} fontWeight="bold">
        {title}
      </Text>
      <Flex direction="row" mt={"16px"} ml={"32px"}>
        <Center>
          {icon}
          <Text fontSize="5xl" color={textColor} fontWeight="900">
            {value}
          </Text>
        </Center>
      </Flex>
    </Card>
  )
}

const StatisticalTracsaction = (props) => {
  const { title, data } = props;
  const textColor = useColorModeValue('gray.700', 'white');

  return (
    <Card minH="125px" bgColor="white" borderRadius="8px">
      <Text fontSize="xl" color={textColor} fontWeight="bold">
        {title}
      </Text>
      <Flex direction="row" justify={"space-between"} mt={"16px"} mx={"32px"}>
        <Box>
          <Center>
            <IconBox borderRadius="50%" as="box" h={'45px'} w={'45px'} mr={"16px"}>
              <GiMoneyStack size={"45"} />
            </IconBox>
            <Text fontSize="5xl" color={textColor} fontWeight="900">
              {data.total}
            </Text>
          </Center>
        </Box>
        <Box>
          <Center>
            <IconBox borderRadius="50%" as="box" h={'45px'} w={'45px'} mr={"16px"}>
              <MdOutlinePayments size={"45"} />
            </IconBox>
            <Text fontSize="5xl" color={textColor} fontWeight="900">
              {data.amount}
            </Text>
          </Center>
        </Box>
      </Flex>
    </Card>
  )
}