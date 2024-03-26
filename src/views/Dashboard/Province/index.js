import { Flex, FormControl, FormLabel, Input, Stack, Text, useColorModeValue } from "@chakra-ui/react";
import Card from "components/Card/Card";
import CardBody from "components/Card/CardBody";
import CardHeader from "components/Card/CardHeader";
import { useState, useEffect } from "react";
import { useQueryGetCountries, useQueryGetStayeByCountryCode } from "services/countries";
import CountryTable from "./Table";
import Pagination from "components/Pagination/Pagination";
import { Select } from "chakra-react-select";
import { mappingOptionSelect } from "utils/mapping";

const initialFilter = {
  country: {
    value: "US",
    label: "United States"
  },
  pageSize: 10,
  pageIndex: 0,
  searchKeyword: ''
}

export default function Province() {
  const textColor = useColorModeValue('gray.700', 'white');
  const [filters, setFilters] = useState(initialFilter)
  const { data: countries } = useQueryGetCountries();
  const { data: states, refetch } = useQueryGetStayeByCountryCode(filters);
  const [shippingFee, setShippingFee] = useState(0)

  useEffect(() => {
    if (countries?.data?.length) {
      const country = countries.data.filter(item => item.code === 'US');
      if (country?.length > 0) {
        setShippingFee(country[0].shippingFee)
      }
    }
  }, [countries])

  const handleFilter = e => {
    setFilters({ ...filters, country: e })
  }

  return (
    <>
      <Flex direction="column" pt={{ base: '120px', md: '75px', lg: '100px' }}>
        <Card p="16px" mb="24px" bg="#fff">
          <CardHeader p="12px 5px" mb="12px">
            <Flex justifyContent={'space-between'}>
              <Flex direction={'column'}>
                <Text fontSize="xl" color={textColor} fontWeight="bold">
                  Quốc gia
                </Text>
                <Flex direction={'row'} mt={"16px"}>
                  <Text fontSize="14px" color={textColor} fontWeight={"600"}>
                    Phí vận chuyển:
                  </Text>
                  <Text fontSize="14px" color={textColor} ml={"3px"} fontWeight={"600"}>
                    {shippingFee}$
                  </Text>
                </Flex>
                <Flex direction={'row'}>
                  <FormControl mt={"16px"} width={{ base: 'full', sm: '300px' }} mr={"16px"}>
                    <FormLabel>Tìm kiếm thành phố</FormLabel>
                    <Input value={filters.searchKeyword} onChange={e => setFilters({ ...filters, searchKeyword: e.target.value })} />
                  </FormControl>
                  <FormControl mt={"16px"} width={{ base: 'full', sm: '300px' }}>
                    <FormLabel>Quốc gia</FormLabel>
                    <Select
                      isClearable
                      isDisabled
                      menuShouldBlockScroll
                      value={filters?.country || null}
                      onChange={e => handleFilter(e)}
                      options={mappingOptionSelect(countries?.data, 'name', 'code')}
                    ></Select>
                  </FormControl>
                </Flex>
              </Flex>
            </Flex>
          </CardHeader>
          <CardBody overflowX="auto">
            <Stack overflow={'auto'}>
              <CountryTable states={states?.data || []} refetch={refetch} />
            </Stack>
            <Flex justifyContent={'flex-end'}>
              <Pagination
                page={states?.pagination?.page}
                pageLength={states?.pagination?.pageSize}
                totalRecords={states?.pagination?.count}
                onPageChange={(page, pageLength) => {
                  setFilters({
                    ...filters,
                    pageSize: pageLength,
                    pageIndex: page - 1,
                  });
                }}
              />
            </Flex>
          </CardBody>
        </Card>
      </Flex>
    </>
  )
};