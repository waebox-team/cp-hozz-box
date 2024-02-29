import React, { useEffect, useState } from 'react';
import {
  Button,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogCloseButton,
  useToast,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import isEmpty from 'lodash/isEmpty';
import { useParams } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import InputController from 'components/Form/InputController';
import { SizeFormValidate } from 'utils/validation';
import { ModalType } from 'constants/common';
import { useCreateSizeMutation } from 'services/size';

const CreateSizeModal = ({ isOpen, sizeDetail, onClose, refetch }) => {
  const params = useParams();
  const { id: categoryId } = params || {};
  const cancelRef = React.useRef();
  const toast = useToast();
  const createSizeMutation = useCreateSizeMutation();

  const { control, handleSubmit, reset } = useForm({
    resolver: yupResolver(SizeFormValidate),
    defaultValues: {
      name: '',
    },
  });

  //   useEffect(() => {
  //     reset({ status: TicketStatusOption.find(item => item.value === ticketDetail.status) });
  //   }, [ticketDetail]);

  const handleSuccess = () => {
    toast({
      title: 'Tạo kích thước thành công',
      status: 'success',
      duration: 9000,
      isClosable: true,
    });
    refetch?.();
    onClose(ModalType.Add);
  };

  const handleError = error => {
    toast({
      title: error?.response?.data?.errors?.[0]?.msg || error?.response?.data?.msg || 'Tạo kích thước thất bại',
      status: 'error',
      duration: 9000,
      isClosable: true,
    });
  };

  const onSubmit = values => {
    createSizeMutation.mutate({ ...values, categoryId }, { onSuccess: () => handleSuccess(), onError: error => handleError(error) });
  };

  return (
    <>
      <AlertDialog
        motionPreset="slideInBottom"
        leastDestructiveRef={cancelRef}
        onClose={() => {
          onClose(ModalType.Add);
        }}
        isOpen={isOpen}
        isCentered
      >
        <AlertDialogOverlay />

        <AlertDialogContent>
          <AlertDialogHeader textTransform="uppercase">Thêm size</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>
            <form>
              <InputController control={control} name="name" label="Tên kích thước" isRequired />
            </form>
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button
              ref={cancelRef}
              onClick={() => {
                onClose(ModalType.Add);
              }}
            >
              Hủy
            </Button>
            <Button colorScheme="blue" ml={3} isLoading={false} onClick={handleSubmit(onSubmit)}>
              Thêm
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default CreateSizeModal;
