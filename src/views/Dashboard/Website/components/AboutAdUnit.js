import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Flex,
  Text,
} from '@chakra-ui/react';
import React from 'react';
import InputController from 'components/Form/InputController';
import { useForm } from 'react-hook-form';
import { GetCodeNativeFormValidate } from 'utils/validation';
import { yupResolver } from '@hookform/resolvers/yup';

const AboutAdUnit = ({ website, isOpen, onClose }) => {
  const cancelRef = React.useRef();

  const { control, handleSubmit } = useForm({
    resolver: yupResolver(GetCodeNativeFormValidate),
    defaultValues: {},
  });

  const onSubmit = () => {};

  return (
    <AlertDialog motionPreset="slideInBottom" leastDestructiveRef={cancelRef} onClose={onClose} isOpen={isOpen} isCentered>
      <AlertDialogOverlay />
      <AlertDialogContent padding={6} marginX={'10%'}>
        <AlertDialogHeader>
          <Text gap={2} fontSize={'20px'}>
            About Ad Unit
          </Text>
        </AlertDialogHeader>
        <AlertDialogCloseButton margin={10} fontSize={16} />
        <AlertDialogBody overflowX="auto" ontSize={'16px'}>
          <form>
            <Flex color="white" marginTop={6} gap={10}>
              <Flex flex="1" flexDirection={'column'} color={'#121F4B'} textColor={'#222222'} fontSize={14}>
                <InputController
                  defaultValue={website.banner.name + '_1'}
                  control={control}
                  name="color"
                  label="Name"
                  styleBoxInput={{ flex: 1 }}
                  styleLabel={{ marginTop: '10px' }}
                />
                <Flex mt={6}>
                  <Text width={20} color={'#727272'}>
                    Format:
                  </Text>
                  <Text>{website.banner.adUnit}</Text>
                </Flex>
                <Flex mt={3}>
                  <Text width={20} color={'#727272'}>
                    ID:
                  </Text>
                  <Text>{website.banner._id}</Text>
                </Flex>
                <Flex mt={3}>
                  <Text width={20} color={'#727272'}>
                    Website:
                  </Text>
                  <Text>{website.website.url}</Text>
                </Flex>
                <Flex justifyContent={"flex-end"} gap={4}>
                  <Button marginTop={6} float={'right'} onClick={onClose}>
                    Close
                  </Button>
                  <Button marginTop={6} float={'right'} onClick={handleSubmit(onSubmit)}>
                    Save
                  </Button>
                </Flex>
              </Flex>
            </Flex>
            <br />
          </form>
        </AlertDialogBody>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AboutAdUnit;
