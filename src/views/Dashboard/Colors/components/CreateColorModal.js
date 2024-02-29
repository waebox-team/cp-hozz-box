import React, { useEffect } from 'react';
import {
  Button,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogCloseButton,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import InputController from 'components/Form/InputController';
import { SizeFormValidate } from 'utils/validation';
import { ModalType } from 'constants/common';
import { toast } from 'components/Toast';
import { useCreateColorMutation, useUpdateColorMutation } from 'services/color';

const CreateColorModal = ({ isOpen, colorDetail, onClose, refetch }) => {
  const params = useParams();
  const { id: categoryId } = params || {};
  const cancelRef = React.useRef();
  const createColorMutation = useCreateColorMutation();
  const updateColorMutation = useUpdateColorMutation();

  const { control, handleSubmit, reset } = useForm({
    resolver: yupResolver(SizeFormValidate),
    defaultValues: {
      name: '',
    },
  });

  useEffect(() => {
    if (colorDetail) {
      reset({ name: colorDetail.name, id: colorDetail?._id });
    }
  }, [colorDetail]);

  const handleSuccess = () => {
    toast.showMessageSuccess(`${colorDetail ? 'Cập nhập' : 'Tạo'} màu thành công`);
    refetch?.();
    onClose(ModalType.Add);
  };

  const handleError = error => {
    toast.showMessageError(
      error?.response?.data?.errors?.[0]?.msg || error?.response?.data?.msg || `${colorDetail ? 'Cập nhập' : 'Tạo'} màu thất bại`
    );
  };

  const onSubmit = values => {
    if (colorDetail) {
      updateColorMutation.mutate({ ...values, categoryId }, { onSuccess: () => handleSuccess(), onError: error => handleError(error) });
      return;
    }

    createColorMutation.mutate({ ...values, categoryId }, { onSuccess: () => handleSuccess(), onError: error => handleError(error) });
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
          <AlertDialogHeader textTransform="uppercase">{colorDetail ? 'Cập nhập' : 'Tạo'} màu</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>
            <form>
              <InputController control={control} name="name" label="Tên màu" isRequired />
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
            <Button
              colorScheme="blue"
              ml={3}
              isLoading={createColorMutation.isPending || updateColorMutation.isPending}
              onClick={handleSubmit(onSubmit)}
            >
              {colorDetail ? 'Cập nhập' : 'Tạo'}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default CreateColorModal;
