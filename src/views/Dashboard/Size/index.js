import { useMemo, useState } from 'react';
import { Button, Flex, Stack, Text, useColorModeValue, useDisclosure } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import isEmpty from 'lodash/isEmpty';
import Card from 'components/Card/Card';
import CardBody from 'components/Card/CardBody';
import CardHeader from 'components/Card/CardHeader';
import { ModalType } from 'constants/common';
import CreateSizeModal from './components/CreateSizeModal';
import SizeTable from './components/Table';
import { useQueryGetSize } from 'services/size';
import Pagination from 'components/Pagination/Pagination';

export default function Size() {
  const params = useParams();
  const { id: categoryId } = params || {};
  const textColor = useColorModeValue('gray.700', 'white');
  const [sizeEditing, setSizeEditing] = useState(null);
  const [filter, setFilter] = useState({
    pageIndex: 0,
    pageSize: 10,
    categoryId,
  });
  const { isOpen: isCreateModalOpen, onOpen: onOpenCreateModal, onClose: onCloseCreateModal } = useDisclosure();
  const { isOpen: isChangeStatusModalOpen, onOpen: onOpenChangeStatusModal, onClose: onCloseChangeStatusModal } = useDisclosure();
  const openModal = useMemo(
    () => ({
      [ModalType.Add]: onOpenCreateModal,
      [ModalType.ChangeStatus]: onOpenChangeStatusModal,
    }),
    [onOpenCreateModal, onOpenChangeStatusModal]
  );
  const closeModal = useMemo(
    () => ({
      [ModalType.Add]: onCloseCreateModal,
      [ModalType.ChangeStatus]: onCloseChangeStatusModal,
    }),
    [onCloseCreateModal, onCloseChangeStatusModal]
  );

  const { data: sizesData, refetch } = useQueryGetSize({ ...filter });

  const handleUpdateItem = (size, modalType) => {
    openModal?.[modalType]?.();
    setSizeEditing(size);
  };

  const handelCloseModal = modalType => {
    closeModal?.[modalType]?.();
    setSizeEditing(null);
  };

  return (
    <Flex direction="column" pt={{ base: '120px', md: '75px', lg: '100px' }}>
      <Card p="16px" mb="24px" bg="#fff">
        <CardHeader p="12px 5px" mb="12px">
          <Flex justifyContent={'space-between'}>
            <Flex direction={'column'}>
              <Flex direction="column" gap={'30px'}>
                <Text fontSize="xl" color={textColor} fontWeight="bold">
                  Kích thước
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
            <SizeTable sizesData={sizesData?.data || []} handleUpdateSize={handleUpdateItem} refetch={refetch} />
          </Stack>
          <Flex justifyContent={'flex-end'}>
            {!isEmpty(sizesData?.data) && (
              <Pagination
                page={sizesData?.pagination?.page}
                pageLength={sizesData?.pagination?.pageSize}
                totalRecords={sizesData?.pagination?.count}
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
        <CreateSizeModal sizeDetail={sizeEditing} isOpen={isCreateModalOpen} onClose={handelCloseModal} refetch={refetch} />
      )}
    </Flex>
  );
}
