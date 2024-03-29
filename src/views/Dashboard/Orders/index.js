import { Button, Flex, FormControl, FormLabel, Input, Stack, Text, useColorModeValue } from "@chakra-ui/react"
import Card from "components/Card/Card"
import CardBody from "components/Card/CardBody";
import CardHeader from "components/Card/CardHeader"
import Pagination from "components/Pagination/Pagination";
import { useState } from "react";
import { useQueryGetOrders } from "services/order";
import OrderTable from "./components/Table";
import { Select } from "chakra-react-select";

const initialFilter = {
  pageIndex: 0,
  pageSize: 20
}

export default function Orders() {
  const textColor = useColorModeValue('gray.700', 'white');
  const [filter, setFilter] = useState(initialFilter);
  const [searchTitle, setSearchTitle] = useState('');
  const { data: orders, refetch } = useQueryGetOrders(filter);
  const status = [
    {
      label: 'Đang xử lý',
      value: 'PROCESSING'
    },
    {
      label: 'Xác nhận',
      value: 'APPROVED'
    },
    {
      label: 'Từ chối',
      value: 'REJECTED'
    }
  ]

  const handleSearch = () => {
    setFilter({
      ...filter,
      searchKeyword: searchTitle,
    });
  };

  return (
    <Flex direction="column" pt={{ base: '120px', md: '75px', lg: '100px' }}>
      <Card p="16px" mb="24px" bg="#fff">
        <CardHeader p="12px 5px" mb="12px">
          <Flex justifyContent={'space-between'} direction={"column"}>
            <Flex direction="column" gap={'30px'}>
              <Text fontSize="xl" color={textColor} fontWeight="bold">
                Quản lý đơn hàng
              </Text>
            </Flex>
            <Flex direction={"row"} gap={'20px'} mt={'20px'}>
              <FormControl width={{ base: 'full', sm: '300px' }}>
                <FormLabel>Tìm kiếm đơn hàng</FormLabel>
                <Input value={searchTitle} onChange={e => setSearchTitle(e.target.value)} />
              </FormControl>
              <Button variant="primary" maxH="40px" alignSelf={'end'} onClick={handleSearch}>
                <Text fontSize="md" fontWeight="bold" cursor="pointer">
                  Tìm kiếm
                </Text>
              </Button>
              <FormControl width={{ base: 'full', sm: '300px' }}>
                <FormLabel>Thành viên</FormLabel>
                <Select
                  isClearable
                  menuShouldBlockScroll
                  value={filter?.status || null}
                  onChange={e => {
                    setFilter(prev => ({
                      ...prev,
                      status: e,
                    }));
                  }}
                  options={status}
                ></Select>
              </FormControl>
            </Flex>
          </Flex>
        </CardHeader>
        <CardBody overflowX="auto">
          <Stack overflow={'auto'}>
            <OrderTable ordersData={orders?.data || []} refetch={refetch} />
          </Stack>
          <Flex justifyContent={'flex-end'}>
            <Pagination
              page={orders?.pagination?.page}
              pageLength={orders?.pagination?.pageSize}
              totalRecords={orders?.pagination?.count}
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
  )
}