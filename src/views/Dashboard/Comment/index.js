import { Flex, FormControl, FormLabel, Stack, Text, useColorModeValue } from "@chakra-ui/react";
import Card from "components/Card/Card";
import CardBody from "components/Card/CardBody";
import CardHeader from "components/Card/CardHeader";
import { useState } from "react";
import { useQueryGetCommentByAdmin } from "services/comment";
import CommentTable from "./components/Table";
import DatePicker from 'components/DatePicker/DatePicker';
import moment from 'moment';
import { getInitFilerChart } from "utils/helpers";
import { Select } from 'chakra-react-select';
import { useQueryGetListMember } from "services/purchase-history";
import { useQueryGetProducts } from "services/product";
import { mappingOptionSelect } from "utils/mapping";
import Pagination from "components/Pagination/Pagination";

const initFiler = {
  endTime: getInitFilerChart().endDate,
  startTime: getInitFilerChart().startDate,
};

export const initialFilter = {
  pageSize: 10,
  pageIndex: 0,
  member: '',
  product: '',
  endTime: getInitFilerChart().endDate,
  startTime: getInitFilerChart().startDate,
};

export const mappingOptionSelectMember = (data, labelKey = 'name', valueKey = '_id', subLabelKey) =>
  data?.map(item => ({
    label: item?.[labelKey] + `${subLabelKey ? ` (${item?.[subLabelKey]})` : ''}`,
    value: item?.[valueKey],
  }));

export default function Comment() {
  const textColor = useColorModeValue('gray.700', 'white');
  const [filter, setFilter] = useState(initialFilter);
  const { data: comments, refetch } = useQueryGetCommentByAdmin(filter);
  const { data: members } = useQueryGetListMember();
  const { data: products } = useQueryGetProducts();

  const onChangeDate = type => date => {
    setFilter(prev => ({
      ...prev,
      ...(type === 'startTime' && { endTime: new Date(formatDate(moment(date).add(6, 'days'))) }),
      [type]: date,
    }));
  };

  return (
    <>
      <Flex direction="column" pt={{ base: '120px', md: '75px', lg: '100px' }}>
        <Card p="16px" mb="24px" bg="#fff">
          <CardHeader p="12px 5px" mb="12px">
            <Flex justifyContent={'space-between'}>
              <Flex direction={'column'}>
                <Flex direction="column" gap={'30px'}>
                  <Text fontSize="xl" color={textColor} fontWeight="bold">
                    Bình luận
                  </Text>
                </Flex>
                <Flex justifyContent={'space-between'} alignItems={'end'} gap={'20px'} mt={'20px'}>
                  <Stack>
                    <Flex alignItems={'center'} gap={'14px'} flexWrap={'wrap'}>
                      <FormControl display="flex" flexDirection={'column'} width={{ base: 'full', sm: '300px' }}>
                        <FormLabel mb="2" fontWeight={700}>Ngày bắt đầu</FormLabel>
                        <DatePicker selectedDate={filter.startTime} onChange={date => onChangeDate('startTime')(date)} />
                      </FormControl>
                      <FormControl display="flex" flexDirection={'column'} width={{ base: 'full', sm: '300px' }}>
                        <FormLabel mb="2" fontWeight={700}>Ngày kết thúc</FormLabel>
                        <DatePicker
                          selectedDate={filter.endTime}
                          minDate={filter.startTime}
                          onChange={date => onChangeDate('endTime')(date)}
                        />
                      </FormControl>
                      <FormControl width={{ base: 'full', sm: '300px' }}>
                        <FormLabel>Thành viên</FormLabel>
                        <Select
                          isClearable
                          menuShouldBlockScroll
                          value={filter?.member || null}
                          onChange={e => {
                            setFilter(prev => ({
                              ...prev,
                              member: e,
                            }));
                          }}
                          options={mappingOptionSelectMember(members?.data, 'fullname', '_id', 'email')}
                        ></Select>
                      </FormControl>
                      <FormControl width={{ base: 'full', sm: '300px' }}>
                        <FormLabel>Sản phẩm</FormLabel>
                        <Select
                          isClearable
                          menuShouldBlockScroll
                          value={filter?.product || null}
                          onChange={e => {
                            console.log(e)
                            setFilter(prev => ({
                              ...prev,
                              product: e,
                            }));
                          }}
                          options={mappingOptionSelect(products?.data, 'name', '_id')}
                        ></Select>
                      </FormControl>
                    </Flex>
                  </Stack>
                </Flex>
              </Flex>
            </Flex>
          </CardHeader>
          <CardBody overflowX="auto">
            <Stack overflow={'auto'}>
              <CommentTable comments={comments?.data || []} refetch={refetch} />
            </Stack>
            <Flex justifyContent={'flex-end'}>
              <Pagination
                page={comments?.pagination?.page}
                pageLength={comments?.pagination?.pageSize}
                totalRecords={comments?.pagination?.count}
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
    </>
  )
}