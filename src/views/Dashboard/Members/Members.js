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
import { Select } from 'chakra-react-select';

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
  const actives = [
    {
      label: 'Đã kích hoạt',
      value: 1
    },
    {
      label: 'Chưa kích hoạt',
      value: 0
    },
  ];

  const locks = [
    {
      label: 'Đã khóa',
      value: 1
    },
    {
      label: 'Hoạt động',
      value: 0
    },
  ]

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

  const { data: members, refetch } = useQueryGetListMember({ ...filter }, { enabled: isLoggedIn });;

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
                    <FormControl width={{ base: 'full', sm: '300px' }}>
                      <FormLabel>Tìm kiếm Thành Viên</FormLabel>
                      <Input value={searchTitle} onChange={e => setSearchTitle(e.target.value)} />
                    </FormControl>
                    <Button variant="primary" maxH="40px" alignSelf={'end'} onClick={handleSearch}>
                      <Text fontSize="md" fontWeight="bold" cursor="pointer">
                        Tìm kiếm
                      </Text>
                    </Button>
                    <FormControl width={{ base: 'full', sm: '300px' }}>
                      <FormLabel>Trạng thái kích hoạt</FormLabel>
                      <Select
                        isClearable
                        menuShouldBlockScroll
                        value={filter?.active || null}
                        onChange={e => {
                          setFilter(prev => ({
                            ...prev,
                            active: e,
                          }));
                        }}
                        options={actives}
                      ></Select>
                    </FormControl>
                    <FormControl width={{ base: 'full', sm: '300px' }}>
                      <FormLabel>Trạng thái hoạt động</FormLabel>
                      <Select
                        isClearable
                        menuShouldBlockScroll
                        value={filter?.block || null}
                        onChange={e => {
                          setFilter(prev => ({
                            ...prev,
                            block: e,
                          }));
                        }}
                        options={locks}
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
            <SizeTable membersData={members?.data || []} refetch={refetch} />
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
