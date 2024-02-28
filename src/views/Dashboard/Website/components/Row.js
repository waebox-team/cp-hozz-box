import {
    Button,
    Flex,
    IconButton,
    Td,
    Text,
    Tr,
    useColorModeValue,
} from "@chakra-ui/react";
import React from "react";
import { DeleteIcon, EditIcon, AddIcon, InfoIcon } from "@chakra-ui/icons";
import { formatDate } from "utils/helpers";
import { TYPE_ACTION } from "constants/common";

function Row({ user, isLast, handelUpdateWebsite, categories }) {
    const textColor = useColorModeValue("gray.500", "white");
    const titleColor = useColorModeValue("gray.700", "white");
    const borderColor = useColorModeValue("gray.200", "gray.600");

    const category = ((categoryId) => {
        return categories?.find(item => item._id === categoryId._id)
    })

    const handleRowClick = () => {
        handelUpdateWebsite(user);
    };

    const handleRowClickDelete = () => {
        handelUpdateWebsite(user, TYPE_ACTION.DELETE);
    };

    const handleAdunitClick = () => {
        handelUpdateWebsite(user, TYPE_ACTION.CREATE)
    }

    const handleDetailClick = () => {
        handelUpdateWebsite(user, TYPE_ACTION.DETAIL)
    }

    return (
        <Tr>
            <Td
                minWidth={{ sm: "250px" }}
                pl="0px"
                borderColor={borderColor}
                borderBottom={isLast ? "none" : null}
            >
                <Flex align="center" py=".8rem" minWidth="100%" flexWrap="nowrap">
                    <Flex direction="column">
                        <Text
                            fontSize="md"
                            color={titleColor}
                            fontWeight="bold"
                            minWidth="100%"
                        >
                            {user?.name}
                        </Text>
                    </Flex>
                </Flex>
            </Td>
            <Td borderColor={borderColor} borderBottom={isLast ? "none" : null}>
                <Flex direction="column">
                    <Text fontSize="md" color={textColor} fontWeight="bold">
                        {user?.url}
                    </Text>
                </Flex>
            </Td>
            <Td borderColor={borderColor} borderBottom={isLast ? "none" : null}>
                <Flex direction="column">
                    <Text fontSize="md" color={textColor} fontWeight="bold">
                        {formatDate(user?.updatedAt)}
                    </Text>
                </Flex>
            </Td>
            <Td borderColor={borderColor} borderBottom={isLast ? "none" : null}>
                <Flex direction="column">
                    <Text fontSize="md" color={textColor} fontWeight="bold">
                        {category(user?.categoryId)?.name}
                    </Text>
                </Flex>
            </Td>
            <Td borderColor={borderColor} borderBottom={isLast ? "none" : null}>
                <Button _hover={{ background: "gray.400", color: "white" }} color={textColor} display={"flex"} alignItems={"center"} gap={"6px"} bg="transparent" onClick={() => handleAdunitClick()}>
                    <AddIcon />
                    <span>AD UNIT</span>
                </Button>
            </Td>
            <Td borderColor={borderColor} borderBottom={isLast ? "none" : null}>
                <Button _hover={{ background: "gray.400", color: "white" }} color={textColor} display={"flex"} alignItems={"center"} gap={"6px"} bg="transparent" onClick={() => handleDetailClick()}>
                    <InfoIcon />
                    <span>Detail</span>
                </Button>
            </Td>
            <Td borderColor={borderColor} borderBottom={isLast ? "none" : null}>
                <IconButton
                    p={2}
                    bg="transparent"
                    onClick={() => {
                        handleRowClick();
                    }}
                >
                    <EditIcon />
                </IconButton>
                <IconButton
                    p={2}
                    bg="transparent"
                    onClick={() => {
                        handleRowClickDelete();
                    }}
                >
                    <DeleteIcon />
                </IconButton>
            </Td>
        </Tr>
    );
}

export default Row;
