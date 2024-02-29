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
import { useCreateSizeMutation, useUpdateSizeMutation } from 'services/size';
import { toast } from 'components/Toast';

const CreateSizeModal = ({ isOpen, sizeDetail, onClose, refetch }) => {
  const params = useParams();
  const { id: categoryId } = params || {};
  const cancelRef = React.useRef();
  const createSizeMutation = useCreateSizeMutation();
  const updateSizeMutation = useUpdateSizeMutation();

  const { control, handleSubmit, reset } = useForm({
    resolver: yupResolver(SizeFormValidate),
    defaultValues: {
      name: '',
    },
  });

  useEffect(() => {
    if (sizeDetail) {
      reset({ name: sizeDetail.name, id: sizeDetail?._id });
    }
  }, [sizeDetail]);

  const handleSuccess = () => {
    toast.showMessageSuccess(`${sizeDetail ? 'Cập nhập' : 'Tạo'} kích thước thành công`);
    refetch?.();
    onClose(ModalType.Add);
  };

  const handleError = error => {
    toast.showMessageError(
      error?.response?.data?.errors?.[0]?.msg || error?.response?.data?.msg || `${sizeDetail ? 'Cập nhập' : 'Tạo'} kích thước thất bại`
    );
  };

  const onSubmit = values => {
    if (sizeDetail) {
      updateSizeMutation.mutate({ ...values, categoryId }, { onSuccess: () => handleSuccess(), onError: error => handleError(error) });
      return;
    }

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
          <AlertDialogHeader textTransform="uppercase">{sizeDetail ? 'Cập nhập' : 'Tạo'} size</AlertDialogHeader>
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
            <Button
              colorScheme="blue"
              ml={3}
              isLoading={createSizeMutation.isPending || updateSizeMutation.isPending}
              onClick={handleSubmit(onSubmit)}
            >
              {sizeDetail ? 'Cập nhập' : 'Tạo'}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default CreateSizeModal;
