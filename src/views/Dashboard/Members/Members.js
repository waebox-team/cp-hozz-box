import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Text,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { CookieStorage } from 'utils/cookie-storage';
import { useHistory } from 'react-router-dom';
import { useMemo } from 'react';
import { ModalType } from 'constants/common';
import SizeTable from './components/Table';
// import CreateCategoryModal from './components/CreateCategoryModal';
import Pagination from 'components/Pagination/Pagination';
import { useQueryGetListMember } from 'services/purchase-history';

function Members() {
  const isLoggedIn = CookieStorage.isAuthenticated();
  const textColor = useColorModeValue('gray.700', 'white');
  const history = useHistory();
  const [sizeEditing, setSizeEditing] = useState(null);
  const [filter, setFilter] = useState({
    pageIndex: 0,
    pageSize: 20
  });
  const [searchTitle, setSearchTitle] = useState('');

  useEffect(() => {
    if (!isLoggedIn) {
      return history.push('/auth/sign-in');
    }
  }, [isLoggedIn, history]);

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

  const { data: members, refetch } = useQueryGetListMember({ ...filter }, { enabled: isLoggedIn });

  const handleUpdateItem = (size, modalType) => {
    openModal?.[modalType]?.();
    setSizeEditing(size);
  };

  const handelCloseModal = modalType => {
    closeModal?.[modalType]?.();
    setSizeEditing(null);
  };

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
          <Flex justifyContent={'space-between'}>
            <Flex direction={'column'}>
              <Flex direction="column" gap={'30px'}>
                <Text fontSize="xl" color={textColor} fontWeight="bold">
                  Quản lý thành viên
                </Text>
              </Flex>
              <Flex justifyContent={'space-between'} alignItems={'end'} gap={'20px'} mt={'20px'}>
                <Stack>
                  <Flex alignItems={'center'} gap={'20px'} flexWrap={{ base: 'wrap', md: 'nowrap' }}>
                    <FormControl minWidth={{ base: 'full', sm: '300px' }}>
                      <FormLabel>Tìm kiếm Thành Viên</FormLabel>
                      <Input value={searchTitle} onChange={e => setSearchTitle(e.target.value)} />
                    </FormControl>
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
            <SizeTable categorysData={members?.data || []} handleUpdateCategory={handleUpdateItem} refetch={refetch} />
          </Stack>
          <Flex justifyContent={'flex-end'}>
            <Pagination
              page={members?.pagination?.page}
              pageLength={members?.pagination?.pageSize}
              totalRecords={members?.pagination?.count}
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
      {/* {isCreateModalOpen && (
        <CreateCategoryModal categorysDetail={sizeEditing} isOpen={isCreateModalOpen} onClose={handelCloseModal} refetch={refetch} />
      )} */}
    </Flex>
  );
}

export default Members;
