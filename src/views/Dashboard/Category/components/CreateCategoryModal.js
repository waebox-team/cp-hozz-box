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
import InputController from 'components/Form/InputController';
import { ModalType } from 'constants/common';
import { toast } from 'components/Toast';
import { useUpdateCategoryMutation, useCreateCategoryMutation, useUpdateThumnailMutation } from 'services/category';
import { CategoryFormValidate } from 'utils/validation';
import { yupResolver } from '@hookform/resolvers/yup';

const CreateCategoryModal = ({ isOpen, categorysDetail, onClose, refetch }) => {
  const params = useParams();
  const { id: categoryId } = params || {};
  const cancelRef = React.useRef();
  const createCategoryMutation = useCreateCategoryMutation();
  const updateCategoryMutation = useUpdateCategoryMutation();
  const updateThumnailMutation = useUpdateThumnailMutation();
  const { control, handleSubmit, reset, setValue } = useForm({
    resolver: yupResolver(CategoryFormValidate),
    defaultValues: {
      title: '',
      description: '',
      thumbnail: '',
    },
  });

  useEffect(() => {
    if (categorysDetail) {
      reset({ title: categorysDetail.title, description: categorysDetail.description, thumbnail: categorysDetail.thumbnail, id: categorysDetail?._id });
    }
  }, [categorysDetail]);

  const handleSuccess = () => {
    toast.showMessageSuccess(`${categorysDetail ? 'Cập nhật' : 'Tạo'} Danh mục thành công`);
    refetch?.();
    onClose(ModalType.Add);
  };
  const handleError = error => {
    toast.showMessageError(
      error?.response?.data?.errors?.[0]?.msg || error?.response?.data?.msg || `${categorysDetail ? 'Cập nhật' : 'Tạo'} Danh mục thành công`
    );
  };
  const onSubmit = async values => {
    if (categorysDetail) {
      if (categorysDetail.thumbnail === values.thumbnail) {
        updateCategoryMutation.mutate(
          { ...values, categoryId },
          {
            onSuccess: () => {
              handleSuccess();
            },
            onError: error => handleError(error),
          }
        );
      } else {
        const formData = new FormData();
        formData.append('thumbnailFile', values.thumbnail);
        updateThumnailMutation.mutate(formData, {
          onSuccess: res => {
            setValue('thumbnail', res?.data);
            updateCategoryMutation.mutate(
              { ...values, categoryId },
              {
                onSuccess: () => {
                  handleSuccess();
                },
                onError: error => handleError(error),
              }
            );
          },
          onError: error => handleError(error),
        });
      }
    } else {
      createCategoryMutation.mutate(
        { ...values },
        {
          onSuccess: () => handleSuccess(),
          onError: error => handleError(error),
        }
      );
    }
  };

  const handleImage = res => {
    setValue('thumbnail', res.target.files[0]);
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
        <AlertDialogContent  maxW={'600px'} maxH={'400px'} >
          <AlertDialogHeader  textTransform="uppercase">{categorysDetail ? 'Cập nhật' : 'Tạo'} Danh Mục</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody >
              <InputController control={control} name="title" label="Tên"  />
              <InputController control={control} name="description" label="Mô tả" type='textarea' />
            {categorysDetail ? (
                <input type="file"  onChange={res => handleImage(res)} style={{ marginTop: '20px' }} />
            ) : null}
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
              isLoading={createCategoryMutation.isPending || updateCategoryMutation.isPending}
              onClick={handleSubmit(onSubmit)}
            >
              {categorysDetail ? 'Cập nhập' : 'Tạo'}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default CreateCategoryModal;