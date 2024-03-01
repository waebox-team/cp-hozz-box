import { useMemo, useState } from 'react';
import { Button, Flex, Stack, Text, useColorModeValue, useDisclosure } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import isEmpty from 'lodash/isEmpty';
import Card from 'components/Card/Card';
import CardBody from 'components/Card/CardBody';
import CardHeader from 'components/Card/CardHeader';
import { ModalType } from 'constants/common';
import CreateColorModal from './components/CreateColorModal';
import SizeTable from './components/Table';
import Pagination from 'components/Pagination/Pagination';
import { useQueryGetColors } from 'services/color';

export default function Colors() {
  const params = useParams();
  const { id: categoryId } = params || {};
  const textColor = useColorModeValue('gray.700', 'white');
  const [colorEditing, setColorEditing] = useState(null);
  const [filter, setFilter] = useState({
    pageIndex: 0,
    pageSize: 10,
    categoryId,
  });
  const { isOpen: isCreateModalOpen, onOpen: onOpenCreateModal, onClose: onCloseCreateModal } = useDisclosure();
  const openModal = useMemo(
    () => ({
      [ModalType.Add]: onOpenCreateModal,
    }),
    [onOpenCreateModal]
  );
  const closeModal = useMemo(
    () => ({
      [ModalType.Add]: onCloseCreateModal,
    }),
    [onCloseCreateModal]
  );

  const { data: colorsData, refetch } = useQueryGetColors({ ...filter });

  const handleUpdateItem = (size, modalType) => {
    openModal?.[modalType]?.();
    setColorEditing(size);
  };

  const handelCloseModal = modalType => {
    closeModal?.[modalType]?.();
    setColorEditing(null);
  };

  return (
    <Flex direction="column" pt={{ base: '120px', md: '75px', lg: '100px' }}>
      <Card p="16px" mb="24px" bg="#fff">
        <CardHeader p="12px 5px" mb="12px">
          <Flex justifyContent={'space-between'}>
            <Flex direction={'column'}>
              <Flex direction="column" gap={'30px'}>
                <Text fontSize="xl" color={textColor} fontWeight="bold">
                  Màu
                </Text>
              </Flex>
              {/* <Flex justifyContent={'space-between'} alignItems={'end'} gap={'20px'} mt={'20px'}>
                <Stack>
                  <Flex alignItems={'center'} gap={'20px'} flexWrap={{ base: 'wrap', md: 'nowrap' }}>
                    <FormControl minWidth={{ base: 'full', sm: '300px' }}>
                      <FormLabel>Loại ticket</FormLabel>
                      <Select
                        isClearable
                        menuShouldBlockScroll
                        onChange={e => {
                          setTicketType(e);
                        }}
                        options={TypeTicket}
                      ></Select>
                    </FormControl>
                    <FormControl>
                      <FormLabel>Đã phê duyệt</FormLabel>
                      <Switch
                        colorScheme="blue"
                        isChecked={switched}
                        onChange={event => {
                          setSwitched(event.target.checked);
                        }}
                      />
                    </FormControl>
                    <Button variant="primary" maxH="30px" onClick={onFilter} alignSelf={'end'}>
                      Lọc
                    </Button>
                  </Flex>
                </Stack>
              </Flex> */}
            </Flex>
            <Button bg="#3182ce" color="#fff" _hover={{ bg: '#67a1d7' }} onClick={onOpenCreateModal}>
              <Text fontSize="md" fontWeight="bold" cursor="pointer">
                Thêm
              </Text>
            </Button>
          </Flex>
        </CardHeader>
        <CardBody overflowX="auto">
          <Stack overflow={'auto'}>
            <SizeTable colorsData={colorsData?.data || []} handleUpdateColor={handleUpdateItem} refetch={refetch} />
          </Stack>
          <Flex justifyContent={'flex-end'}>
            {!isEmpty(colorsData?.data) && (
              <Pagination
                page={colorsData?.pagination?.page}
                pageLength={colorsData?.pagination?.pageSize}
                totalRecords={colorsData?.pagination?.count}
                onPageChange={(page, pageLength) => {
                  setFilter({
                    ...filter,
                    pageSize: pageLength,
                    pageIndex: page - 1,
                  });
                }}
              />
            )}
          </Flex>
        </CardBody>
      </Card>
      {isCreateModalOpen && (
        <CreateColorModal colorDetail={colorEditing} isOpen={isCreateModalOpen} onClose={handelCloseModal} refetch={refetch} />
      )}
    </Flex>
  );
}
