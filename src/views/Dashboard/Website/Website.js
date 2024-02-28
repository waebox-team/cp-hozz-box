import React, { useState } from 'react';
import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Stack,
  Switch,
  Table,
  Tbody,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import Card from 'components/Card/Card';
import CardBody from 'components/Card/CardBody';
import CardHeader from 'components/Card/CardHeader';
import Pagination from 'components/Pagination/Pagination';
import Row from './components/Row';
import { useQueryGetMyWebsites } from 'services/website';
import CreateWebsite from './components/CreateWebsite';
import { useQueryGetCategoryWebsite, useDeleteWebsiteMutation } from 'services/website';
import { mappingOptionSelect } from 'utils/mapping';
import InputSearch from 'components/InputSearch/InputSearch';
import { Select } from 'chakra-react-select';
import { AdUnitsOptions, TYPE_ACTION } from 'constants/common';
import AddAdUnit from './components/AddAdUnit';
import TableDetailWebsite from './components/TableDetail';
import GetCodeModal from './components/GetCodeModal';
import AboutAdUnit from './components/AboutAdUnit';

export const initialFilter = {
  pageSize: 10,
  pageIndex: 0,
};

function Website() {
  const [editWebsite, seteditWebsite] = useState(null);
  const [filter, setFilter] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [searchKeyword, setSearchKeyword] = useState('');
  const [category, setCategory] = useState(null);
  const [adUnit, setadUnit] = useState(null);
  const [switched, setSwitched] = useState(false);
  const [getCode, setGetCode] = useState(null)

  const textColor = useColorModeValue('gray.700', 'white');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const toast = useToast();
  const deleteWebsite = useDeleteWebsiteMutation();

  const { isOpen: isRegisterOpen, onOpen: onRegisterOpen, onClose: onRegisterClose } = useDisclosure();
  const { isOpen: isAdunitOpen, onOpen: onAdunitOpen, onClose: onAdunitClose } = useDisclosure();
  const { isOpen: isTableDetailOpen, onOpen: onTableDetailOpen, onClose: onTableDetailClose } = useDisclosure();
  const { isOpen: isGetCodeOpen, onOpen: onGetCodeOpen, onClose: onGetCodeClose } = useDisclosure();
  const { isOpen: isAboutOpen, onOpen: onAboutOpen, onClose: onAboutClose } = useDisclosure();

  const {
    data,
    // isLoading: isLoadingComics,
    refetch,
  } = useQueryGetMyWebsites({
    ...filter,
  });

  const { data: categories } = useQueryGetCategoryWebsite();

  const onClearSearch = () => {
    setFilter(initialFilter);
    setSearchKeyword('');
  };

  const onChangeSearch = event => {
    event.persist();
    setSearchKeyword(event.target.value);
  };

  const onFilter = () => {
    setFilter({
      ...filter,
      searchKeyword,
      categoryId: category?.value,
      adUnit: adUnit?.value,
      isApprove: switched,
    });
  };

  const handelUpdateBannerWebsite = (infor) => {
    onGetCodeOpen()
    setGetCode(infor)
  }

  const handleAbout = (infor) => {
    onAboutOpen()
    setGetCode(infor)
  }

  const handelUpdateWebsite = (website, type = TYPE_ACTION.UPDATE) => {
    if (type === TYPE_ACTION.DETAIL) {
      onTableDetailOpen();
      seteditWebsite(website);
      return;
    }
    if (type === TYPE_ACTION.CREATE) {
      onAdunitOpen();
      seteditWebsite(website);
      return;
    }
    if (type === TYPE_ACTION.UPDATE) {
      onRegisterOpen();
      seteditWebsite(website);
      return;
    }
    if (type === TYPE_ACTION.DELETE) {
      if (window.confirm('Are you sure to remove this website')) {
        deleteWebsite.mutate(
          {
            websiteId: website._id,
          },
          {
            onSuccess: () => {
              toast({
                title: 'Đã xóa thành công.',
                status: 'success',
                duration: 9000,
                isClosable: true,
              });
              if (filter.pageIndex > 0 && data?.data?.length - 1 === 0) {
                setFilter({
                  ...filter,
                  pageIndex: filter.pageIndex - 1,
                });
              } else {
                refetch();
              }
              onRegisterClose();
            },
          }
        );
      }
    }
  };

  const handleCloseModal = () => {
    seteditWebsite(null);
    onRegisterClose();
    onAdunitClose();
    onTableDetailClose();
  };

  const handelCloseGetCodeModal = () => {
    setGetCode(null);
    onGetCodeClose()
    onAboutClose()
  };

  return (
    <Flex direction="column" pt={{ base: '120px', md: '75px', lg: '100px' }}>
      <Card p="16px" mb="24px" bg="#fff">
        <CardHeader p="12px 5px" mb="12px">
          <Flex justifyContent={'space-between'}>
            <Flex flexDirection={'column'}>
              <Flex direction="column">
                <Text fontSize="xl" color={textColor} fontWeight="bold">
                  Website
                </Text>
              </Flex>
              <Flex justifyContent={'space-between'} alignItems={'end'} gap={'20px'} mt={'20px'}>
                <Stack>
                  <Flex flex="1" gap={'16px'}>
                    <InputSearch value={searchKeyword} onChange={onChangeSearch} onClearSearch={onClearSearch} />
                    <FormControl>
                      <FormLabel m={0}>Đã phê duyệt</FormLabel>
                      <Switch
                        colorScheme="blue"
                        isChecked={switched}
                        onChange={event => {
                          setSwitched(event.target.checked);
                        }}
                      />
                    </FormControl>
                  </Flex>
                  <Flex alignItems={'center'} gap={'20px'} flexWrap={{ base: 'wrap', md: 'nowrap' }}>
                    <FormControl minWidth={{ base: '200px', sm: '300px' }}>
                      <FormLabel>Loại</FormLabel>
                      <Select
                        isClearable
                        onChange={e => {
                          setCategory(e);
                        }}
                        options={mappingOptionSelect(categories?.data)}
                        backspaceRemovesValue
                      ></Select>
                    </FormControl>
                    <FormControl minWidth={{ base: '200px', sm: '300px' }}>
                      <FormLabel>Ad units</FormLabel>
                      <Select
                        isClearable
                        menuShouldBlockScroll
                        onChange={e => {
                          setadUnit(e);
                        }}
                        options={AdUnitsOptions}
                      ></Select>
                    </FormControl>
                    <Button variant="primary" maxH="30px" onClick={onFilter} alignSelf={'end'}>
                      Lọc
                    </Button>
                  </Flex>
                </Stack>
              </Flex>
            </Flex>
            <Button bg="#3182ce" color="#fff" _hover={{ bg: '#67a1d7' }} onClick={onRegisterOpen} padding={'0 20px'}>
              <Text fontSize="md" fontWeight="bold" cursor="pointer">
                Thêm
              </Text>
            </Button>
          </Flex>
        </CardHeader>
        <CardBody overflowX="auto">
          <Table variant="simple" color={textColor}>
            <Thead>
              <Tr my=".8rem" pl="0px" color="gray.400">
                <Th pl="0px" borderColor={borderColor} color="gray.400">
                  Tên
                </Th>
                <Th borderColor={borderColor} color="gray.400">
                  Đường dẫn
                </Th>
                <Th borderColor={borderColor} color="gray.400">
                  Ngày cập nhập
                </Th>
                <Th borderColor={borderColor} color="gray.400">
                  Loại
                </Th>
                <Th borderColor={borderColor}></Th>
                <Th borderColor={borderColor}></Th>
                <Th borderColor={borderColor}></Th>
              </Tr>
            </Thead>
            <Tbody>
              {data?.data?.map((row, index, arr) => {
                return (
                  <Row
                    key={row._id}
                    user={row}
                    isLast={index === arr.length - 1 ? true : false}
                    refetch={refetch}
                    handelUpdateWebsite={handelUpdateWebsite}
                    categories={categories?.data}
                  />
                );
              })}
            </Tbody>
          </Table>
          <Flex justifyContent={'flex-end'}>
            <Pagination
              page={data?.pagination?.page}
              pageLength={data?.pagination?.pageSize}
              totalRecords={data?.pagination?.count}
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
      {isAboutOpen && (
        <AboutAdUnit
          website={getCode}
          isOpen={onAboutOpen}
          onClose={handelCloseGetCodeModal}
        />
      )}
      {isGetCodeOpen && (
        <GetCodeModal
          website={getCode}
          isOpen={onGetCodeOpen}
          onClose={handelCloseGetCodeModal}
        />
      )}
      {isTableDetailOpen && (
        <TableDetailWebsite
          website={editWebsite}
          isOpen={isTableDetailOpen}
          categories={mappingOptionSelect(categories?.data)}
          onClose={handleCloseModal}
          handelUpdateBannerWebsite={handelUpdateBannerWebsite}
          handleAbout={handleAbout}
        />
      )}
      {isRegisterOpen && (
        <CreateWebsite
          editWebsiteDetail={editWebsite}
          categories={mappingOptionSelect(categories?.data)}
          refetch={refetch}
          isOpen={isRegisterOpen}
          onClose={handleCloseModal}
        />
      )}
      {isAdunitOpen && <AddAdUnit editWebsiteDetail={editWebsite} refetch={refetch} isOpen={isAdunitOpen} onClose={handleCloseModal} />}
    </Flex>
  );
}

export default Website;
