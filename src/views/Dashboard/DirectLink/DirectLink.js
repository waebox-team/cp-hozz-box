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
} from '@chakra-ui/react';
import Card from 'components/Card/Card';
import CardBody from 'components/Card/CardBody';
import CardHeader from 'components/Card/CardHeader';
import Pagination from 'components/Pagination/Pagination';
import Row from './components/Row';
import { useQueryGetMyDirectLinks } from 'services/website';
import CreateDirectLink from './components/CreateDirectLink';
import InputSearch from 'components/InputSearch/InputSearch';
import { Select } from 'chakra-react-select';
import { DirectLinkCategoryOptions, RemoveWebsiteOptions } from 'constants/common';

export const initialFilter = {
    pageSize: 10,
    pageIndex: 0,
};

function DirectLink() {
    const [editDirectLink, seteditDirectLink] = useState(null);
    const [filter, setFilter] = useState({
        pageIndex: 0,
        pageSize: 10
    })
    const [searchKeyword, setSearchKeyword] = useState('');
    const [category,setCategory] = useState(null)
    const [adUnit,setadUnit] = useState(null)
    const [switched, setSwitched] = useState(false);

    const textColor = useColorModeValue('gray.700', 'white');
    const borderColor = useColorModeValue("gray.200", "gray.600");

    const {
        isOpen: isRegisterOpen,
        onOpen: onRegisterOpen,
        onClose: onRegisterClose,
    } = useDisclosure();

    const {
        data,
        // isLoading: isLoadingMyDirectLinks,
        refetch,
    } = useQueryGetMyDirectLinks({
        ...filter
    });

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
            // categoryId: category?.value,
            // adUnit: adUnit?.value,
            // isApprove: switched
        });
    };

    const handelUpdateDirectLink = (directLink) => {
        onRegisterOpen()
        seteditDirectLink(directLink)
    }

    const handelCloseModal = () => {
        seteditDirectLink(null)
        onRegisterClose();
    };

    return (
        <Flex direction="column" pt={{ base: '120px', md: '75px', lg: '100px' }}>
            <Card p="16px" mb="24px" bg='#fff'>
                <CardHeader p="12px 5px" mb="12px">
                    <Flex justifyContent={"space-between"}>
                        <Flex flexDirection={"column"}>
                            <Flex direction="column">
                                <Text fontSize="xl" color={textColor} fontWeight="bold">
                                    Direct Link
                                </Text>
                            </Flex>
                            <Flex justifyContent={'space-between'} alignItems={'end'} gap={"20px"} mt={'20px'}>
                                <Stack>
                                    <Flex flex="1" gap={"16px"}>
                                        <InputSearch value={searchKeyword} onChange={onChangeSearch} onClearSearch={onClearSearch} />
                                        <FormControl>
                                            <FormLabel m={0}>Đã phê duyệt</FormLabel>
                                            <Switch
                                                colorScheme="blue"
                                                isChecked={switched}
                                                onChange={(event) => {
                                                    setSwitched(event.target.checked);
                                                }}
                                            />
                                        </FormControl>
                                    </Flex>
                                    <Flex alignItems={'center'} gap={"20px"} flexWrap={{ base: 'wrap', md: 'nowrap' }}>
                                        <FormControl minWidth={{ base: "200px", sm: '300px' }}>
                                            <FormLabel>Danh mục</FormLabel>
                                            <Select
                                                isClearable
                                                onChange={(e) => {
                                                    setCategory(e);
                                                }}
                                                options={DirectLinkCategoryOptions}
                                                backspaceRemovesValue
                                            >
                                            </Select>
                                        </FormControl>
                                        <FormControl minWidth={{ base: "200px", sm: '300px' }}>
                                            <FormLabel>Kiểu loại bỏ</FormLabel>
                                            <Select
                                                isClearable
                                                menuShouldBlockScroll
                                                onChange={(e) => {
                                                    setadUnit(e);
                                                }}
                                                options={RemoveWebsiteOptions}
                                            >
                                            </Select>
                                        </FormControl>
                                        <Button variant="primary" maxH="30px" onClick={onFilter} alignSelf={"end"}>
                                            Lọc
                                        </Button>
                                    </Flex>
                                </Stack>
                            </Flex>
                        </Flex>
                        <Button
                            bg="#3182ce"
                            color='#fff'
                            _hover={{ bg: '#67a1d7' }}
                            onClick={onRegisterOpen}
                        >
                            <Text
                                fontSize="md"
                                fontWeight="bold"
                                cursor="pointer"
                            >
                                Thêm
                            </Text>
                        </Button>
                    </Flex>
                </CardHeader>
                <CardBody>
                    <Table variant="simple" color={textColor} overflowX="auto">
                        <Thead>
                            <Tr my=".8rem" pl="0px" color="gray.400">
                                <Th pl="0px" borderColor={borderColor} color="gray.400">
                                    Tên
                                </Th>
                                <Th borderColor={borderColor} color="gray.400">
                                    Loại
                                </Th>
                                <Th borderColor={borderColor} color="gray.400">
                                    Kiểu loại bỏ
                                </Th>
                                <Th borderColor={borderColor} color="gray.400">
                                    Kích hoạt
                                </Th>
                                <Th borderColor={borderColor} color="gray.400">
                                    Ngày cập nhập
                                </Th>
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
                                        handelUpdateDirectLink={handelUpdateDirectLink}
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
            {isRegisterOpen && (
                <CreateDirectLink
                    editDirectLinkDetail={editDirectLink}
                    categories={DirectLinkCategoryOptions}
                    refetch={refetch}
                    isOpen={isRegisterOpen}
                    onClose={handelCloseModal}
                />
            )}
        </Flex>
    );
}

export default DirectLink;
