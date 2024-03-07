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
import { useQueryGetListCategory } from 'services/category';
import { CookieStorage } from 'utils/cookie-storage';
import { useHistory } from 'react-router-dom';
import { useMemo } from 'react';
import { ModalType } from 'constants/common';
import SizeTable from './components/Table';
import CreateCategoryModal from './components/CreateCategoryModal';
import Pagination from 'components/Pagination/Pagination';
const isLoggedIn = CookieStorage.isAuthenticated();

function Category() {
  const textColor = useColorModeValue('gray.700', 'white');
  const history = useHistory();
  const [sizeEditing, setSizeEditing] = useState(null);
  const [searchTitle, setSearchTitle] = useState('');
  const [filter, setFilter] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
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

  const { data: categorysData, refetch } = useQueryGetListCategory({ ...filter, searchKeyword: filter.searchTitle }, { enabled: isLoggedIn });

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
      searchTitle: searchTitle,
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
                  Danh sách Danh Mục
                </Text>
              </Flex>
              <Flex justifyContent={'space-between'} alignItems={'end'} gap={'20px'} mt={'20px'}>
                <Stack>
                  <Flex alignItems={'center'} gap={'20px'} flexWrap={{ base: 'wrap', md: 'nowrap' }}>
                    <FormControl minWidth={{ base: 'full', sm: '300px' }}>
                      <FormLabel>Tìm kiếm Danh Mục</FormLabel>
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
            <Button bg="#3182ce" color="#fff" _hover={{ bg: '#67a1d7' }} onClick={onOpenCreateModal}>
              <Text fontSize="md" fontWeight="bold" cursor="pointer">
                Thêm
              </Text>
            </Button>
          </Flex>
        </CardHeader>
        <CardBody overflowX="auto">
          <Stack overflow={'auto'}>
            <SizeTable categorysData={categorysData?.data || []} handleUpdateCategory={handleUpdateItem} refetch={refetch} />
          </Stack>
          <Flex justifyContent={'flex-end'}>
            <Pagination
              page={categorysData?.pagination?.page}
              pageLength={categorysData?.pagination?.pageSize}
              totalRecords={categorysData?.pagination?.count}
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
      {isCreateModalOpen && (
        <CreateCategoryModal categorysDetail={sizeEditing} isOpen={isCreateModalOpen} onClose={handelCloseModal} refetch={refetch} />
      )}
    </Flex>
  );
}

export default Category;
