import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogOverlay,
  Table,
  Tbody,
  Th,
  Thead,
  Button,
  Flex,
  Td,
  Text,
  Tr,
  useColorModeValue,
} from '@chakra-ui/react';
import React from 'react';
import { InfoIcon, LinkIcon } from '@chakra-ui/icons';
import capitalize from 'lodash/capitalize';
import { useQueryGetMyWebsiteAdUnits } from 'services/website';
import { IS_VERIFIED_INFO } from 'constants/common';

const TableDetailWebsite = ({ website, isOpen, onClose, categories, handelUpdateBannerWebsite, handleAbout }) => {
  const textColor = useColorModeValue('gray.700', 'white');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const titleColor = useColorModeValue('gray.700', 'white');
  const cancelRef = React.useRef();

  const { data } = useQueryGetMyWebsiteAdUnits(website?._id, {
    pageSize: 10,
    pageIndex: 0,
  });

  const category = categoryId => {
    return categories?.find(item => item._id === categoryId._id);
  };

  const handleGetCode = banner => {
    handelUpdateBannerWebsite({
      website,
      banner,
    });
  };

  const handleAboutAdunit = (banner) => {
    handleAbout({
      website,
      banner,
    });
  }
  return (
    <AlertDialog motionPreset="slideInBottom" leastDestructiveRef={cancelRef} onClose={onClose} isOpen={isOpen} isCentered>
      <AlertDialogOverlay />
      <AlertDialogContent padding={10} maxWidth={'100%'} marginX={'10%'}>
        <AlertDialogHeader textTransform="uppercase">Thông tin Website</AlertDialogHeader>
        <AlertDialogCloseButton margin={10} fontSize={16} />
        <AlertDialogBody overflowX="auto" paddingBottom={8}>
          <Table variant="simple" color={textColor}>
            <Thead>
              <Tr my=".8rem" pl="0px" color="gray.400">
                <Th pl="0px" borderColor={borderColor} color="gray.400">
                  Tên
                </Th>
                <Th borderColor={borderColor} color="gray.400">
                  Status
                </Th>
                <Th borderColor={borderColor}></Th>
                <Th borderColor={borderColor}></Th>
                <Th borderColor={borderColor}></Th>
              </Tr>
            </Thead>
            <Tbody>
              {data?.data?.map((item, index) => (
                <Tr key={index}>
                  <Td minWidth={{ sm: '200px' }} pl="0px" borderColor={borderColor}>
                    <Flex align="center" py=".8rem" minWidth="100%" flexWrap="nowrap">
                      <Flex direction="column">
                        <Text fontSize="md" color={titleColor} fontWeight="bold" minWidth="100%">
                          {item.name}
                        </Text>
                      </Flex>
                    </Flex>
                  </Td>
                  <Td borderColor={borderColor}>
                    <Flex direction="column">
                      <Text fontSize="md" color={textColor} fontWeight="bold">
                        {capitalize(item?.status)}
                      </Text>
                    </Flex>
                  </Td>
                  <Td borderColor={borderColor}>
                    <Flex direction="column">
                      <Text fontSize="md" color={textColor} fontWeight="bold">
                        {category(website?.categoryId)?.name}
                      </Text>
                    </Flex>
                  </Td>
                  <Td borderColor={borderColor}>
                    <Button
                      _hover={{ background: 'gray.400', color: 'white' }}
                      color={textColor}
                      display={'flex'}
                      alignItems={'center'}
                      gap={'6px'}
                      bg="transparent"
                      onClick={() => handleAboutAdunit(item)}
                    >
                      <InfoIcon />
                      <span>About</span>
                    </Button>
                  </Td>
                  <Td borderColor={borderColor}>
                    {item.status === IS_VERIFIED_INFO.APPROVED && (
                      <Button
                        _hover={{ background: 'gray.400', color: 'white' }}
                        color={textColor}
                        display={'flex'}
                        alignItems={'center'}
                        gap={'6px'}
                        bg="transparent"
                        onClick={() => handleGetCode(item)}
                      >
                        <LinkIcon />
                        <span>Get Code</span>
                      </Button>
                    )}
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </AlertDialogBody>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default TableDetailWebsite;
