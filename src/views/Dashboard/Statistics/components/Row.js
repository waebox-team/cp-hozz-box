import {
    Flex,
    IconButton,
    Td,
    Text,
    Tr,
    useColorModeValue,
} from "@chakra-ui/react";
import React from "react";
import { EditIcon } from "@chakra-ui/icons";
import { formatDate } from "utils/helpers";

function Row({ user, isLast, handelUpdateTicket }) {
    const textColor = useColorModeValue("gray.500", "white");
    const titleColor = useColorModeValue("gray.700", "white");
    const borderColor = useColorModeValue("gray.200", "gray.600");

    const handleRowClick = () => {
        handelUpdateTicket(user);
    };

    return (
        <Tr>
            <Td
                minWidth={{ sm: "100px" }}
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
                            {formatDate(user?.createdAt)}
                        </Text>
                    </Flex>
                </Flex>
            </Td>
            <Td minWidth={{ sm: "150px" }} borderColor={borderColor} borderBottom={isLast ? "none" : null}>
                <Flex direction="column">
                    <Text fontSize="md" color={textColor} fontWeight="bold">
                        {formatDate(user?.updatedAt)}
                    </Text>
                </Flex>
            </Td>
            <Td minWidth={{ sm: "150px" }} borderColor={borderColor} borderBottom={isLast ? "none" : null}>
                <Flex direction="column">
                    <Text fontSize="md" color={textColor} fontWeight="bold">
                        {user?.status}
                    </Text>
                </Flex>
            </Td>
            <Td borderColor={borderColor} borderBottom={isLast ? "none" : null}>
                <Flex direction="column">
                    <Text fontSize="md" color={textColor} fontWeight="bold">
                        {user?.subject}
                    </Text>
                </Flex>
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
            </Td>
        </Tr>
    );
}

export default Row;
