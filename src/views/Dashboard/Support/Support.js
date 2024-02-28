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
import { Select } from 'chakra-react-select';
import { TYPE_ACTION, TypeTicket } from 'constants/common';
import TicketForm from './components/TicketForm';
import { useQueryGetTickets } from 'services/support';

export const initialFilter = {
    pageSize: 10,
    pageIndex: 0,
};

function Support() {
    const textColor = useColorModeValue('gray.700', 'white');
    const borderColor = useColorModeValue("gray.200", "gray.600");
    const [editTicket, seteditTicket] = useState(null);
    const [filter, setFilter] = useState({
        pageIndex: 0,
        pageSize: 10
    })
    const [ticketType, setTicketType] = useState(null)
    const [switched, setSwitched] = useState(false);

    const {
        isOpen: isRegisterOpen,
        onOpen: onRegisterOpen,
        onClose: onRegisterClose,
    } = useDisclosure();

    const {
        data,
        // isLoading: isLoadingComics,
        refetch,
    } = useQueryGetTickets({
        ...filter
    });

    const onFilter = () => {
        setFilter({
            ...filter,
            type: ticketType?.value,
            // status: switched
        });
    };

    const handelUpdateTicket = (editTicket, type = TYPE_ACTION.UPDATE) => {
        if (type === TYPE_ACTION.UPDATE) {
            onRegisterOpen()
            seteditTicket(editTicket)
        }
    }

    const handelCloseModal = () => {
        seteditTicket(null)
        onRegisterClose();
    };

    return (
        <Flex direction="column" pt={{ base: '120px', md: '75px', lg: '100px' }}>
            <Card p="16px" mb="24px" bg='#fff'>
                <CardHeader p="12px 5px" mb="12px">
                    <Flex justifyContent={"space-between"}>
                        <Flex direction={"column"}>
                            <Flex direction="column" gap={"30px"}>
                                <Text fontSize="xl" color={textColor} fontWeight="bold">
                                    Support
                                </Text>
                                <Text fontWeight="normal">
                                    Any questions? You can get in touch via the live chat that big red button over there in the lower right corner.
                                    <br />
                                    However, if you need anything from your old tickets — they will still be here.
                                </Text>
                            </Flex>
                            <Flex justifyContent={'space-between'} alignItems={'end'} gap={"20px"} mt={'20px'}>
                                <Stack>
                                    <Flex alignItems={'center'} gap={"20px"} flexWrap={{ base: 'wrap', md: 'nowrap' }}>
                                        <FormControl minWidth={{ base: "full", sm: '300px' }}>
                                            <FormLabel>Loại ticket</FormLabel>
                                            <Select
                                                isClearable
                                                menuShouldBlockScroll
                                                onChange={(e) => {
                                                    setTicketType(e);
                                                }}
                                                options={TypeTicket}
                                            >
                                            </Select>
                                        </FormControl>
                                        <FormControl>
                                            <FormLabel>Đã phê duyệt</FormLabel>
                                            <Switch
                                                colorScheme="blue"
                                                isChecked={switched}
                                                onChange={(event) => {
                                                    setSwitched(event.target.checked);
                                                }}
                                            />
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
                <CardBody overflowX="auto">
                    <Table variant="simple" color={textColor} overflowX="auto">
                        <Thead>
                            <Tr my=".8rem" pl="0px" color="gray.400">
                                <Th pl="0px" borderColor={borderColor} color="gray.400">
                                    Được tạo ra
                                </Th>
                                <Th borderColor={borderColor} color="gray.400">
                                    Đã cập nhật vào
                                </Th>
                                <Th borderColor={borderColor} color="gray.400">
                                    Trạng thái
                                </Th>
                                <Th borderColor={borderColor} color="gray.400">
                                    Chủ đề
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
                                        handelUpdateTicket={handelUpdateTicket}
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
                <TicketForm
                    editTicketDetail={editTicket}
                    refetch={refetch}
                    isOpen={isRegisterOpen}
                    onClose={handelCloseModal}
                />
            )}
        </Flex>
    );
}

export default Support;
