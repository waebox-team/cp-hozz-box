import React, { useMemo, useState } from 'react';
import { Box, Button, Flex, FormControl, FormLabel, useColorModeValue, Text } from '@chakra-ui/react';
import BarChart from 'components/Charts/BarChart';
import DatePicker from 'components/DatePicker/DatePicker';
import moment from 'moment';
import { formatDate } from 'utils/helpers';
import { getInitFilerChart } from 'utils/helpers';

const Week = [0, 1, 2, 3, 4, 5, 6];
const MAX_Y = 5;
const BarChartOptions = {
  chart: {
    toolbar: {
      show: false,
    },
  },
  tooltip: {
    theme: 'dark',
  },
  xaxis: {
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    labels: {
      style: {
        colors: '#A0AEC0',
        fontSize: '12px',
      },
    },
    show: true,
    axisBorder: {
      show: false,
    },
  },
  yaxis: {
    show: true,
    color: '#A0AEC0',
    min: 0,
    max: 5,
    tickAmount: 5,
    labels: {
      show: true,
      style: {
        colors: '#A0AEC0',
        fontSize: '14px',
      },
    },
  },
  fill: {
    colors: '#ED8936',
  },
  dataLabels: {
    enabled: false,
  },
  grid: {
    strokeDashArray: 5,
  },
  plotOptions: {
    bar: {
      borderRadius: 15,
      columnWidth: '15px',
    },
  },
  responsive: [
    {
      breakpoint: 768,
      options: {
        plotOptions: {
          bar: {
            borderRadius: 0,
          },
        },
      },
    },
  ],
};

const initFiler = getInitFilerChart();

const DailyChart = ({ title = 'Thống kê', labelChart = 'Số liệu', dataChart, getNewData, onClickChart }) => {
  const textColor = useColorModeValue('gray.700', 'white');
  const [filter, setFilter] = useState({ ...initFiler });
  const [categories, setCategories] = useState(
    [...Week]
      .slice(0, moment(initFiler.endDate).diff(moment(initFiler.startDate), 'days') + 1)
      .map(item => formatDate(moment(initFiler.startDate).add(item, 'days'), 'DD-MM-YYYY'))
  );

  const onChangeDate = type => date => {
    setFilter(prev => ({
      ...prev,
      ...(type === 'startDate' && { endDate: new Date(formatDate(moment(date).add(6, 'days'))) }),
      [type]: date,
    }));
  };

  const barChartData = useMemo(() => {
    const qty = dataChart?.length ? dataChart.map(daily => daily?.qty || 0) : [];
    const total = qty?.reduce((a, b) => a + b, 0);
    const data = [
      {
        name: labelChart,
        data: qty,
      },
    ];

    return { data, total };
  }, [dataChart, labelChart]);

  const barChartOptions = useMemo(
    () => ({
      ...BarChartOptions,
      chart: {
        ...BarChartOptions.chart,
        ...(onClickChart && {
          events: {
            dataPointSelection: () => {
              onClickChart(filter.startDate, filter.endDate);
            },
          },
        }),
      },
      xaxis: {
        ...BarChartOptions.xaxis,
        categories,
      },
      yaxis: {
        ...BarChartOptions.yaxis,
        max: barChartData.total + MAX_Y,
      },
    }),
    [initFiler, categories, barChartData?.total, onClickChart]
  );

  const onFilter = () => {
    getNewData(filter.startDate, filter.endDate);
    setCategories(
      [...Week]
        .slice(0, moment(filter.endDate).diff(moment(filter.startDate), 'days') + 1)
        .map(item => formatDate(moment(filter.startDate).add(item, 'days'), 'DD-MM-YYYY'))
    );
  };

  return (
    <>
      <Flex direction="column" mb="40px" p="28px 0px 0px 22px">
        <Text color={textColor} fontSize="lg" fontWeight="bold">
          {title}
        </Text>
      </Flex>
      <Flex pl="22px" flexWrap="wrap">
        <FormControl display="flex" alignItems="center" maxW="300px" mr="12px">
          <FormLabel m="0" pr="10px">
            Start Date:
          </FormLabel>
          <DatePicker selectedDate={filter.startDate} onChange={date => onChangeDate('startDate')(date)} />
        </FormControl>
        <FormControl display="flex" alignItems="center" maxW="300px" mr="12px">
          <FormLabel m="0" pr="10px">
            End Date:
          </FormLabel>
          <DatePicker
            selectedDate={filter.endDate}
            minDate={filter.startDate}
            maxDate={new Date(formatDate(moment(filter.startDate).add(6, 'days')))}
            onChange={date => onChangeDate('endDate')(date)}
          />
        </FormControl>
        <Button variant="primary" fontSize="14px" onClick={onFilter}>
          Lọc
        </Button>
      </Flex>
      <Box minH="300px">
        <BarChart chartData={barChartData.data} chartOptions={barChartOptions} />
      </Box>
    </>
  );
};

export default DailyChart;
