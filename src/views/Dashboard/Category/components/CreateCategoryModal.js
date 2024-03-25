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
} from '@chakra-ui/react';
import { useForm, Controller } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import InputController from 'components/Form/InputController';
import { ModalType } from 'constants/common';
import { toast } from 'components/Toast';
import { useUpdateCategoryMutation, useCreateCategoryMutation, useUpdateThumbnailMutation } from 'services/category';
import { CategoryFormValidate } from 'utils/validation';
import { yupResolver } from '@hookform/resolvers/yup';

const CreateCategoryModal = ({ isOpen, categorysDetail, onClose, refetch }) => {
  const params = useParams();
  const { id: categoryId } = params || {};
  const cancelRef = React.useRef();
  const createCategoryMutation = useCreateCategoryMutation();
  const updateCategoryMutation = useUpdateCategoryMutation();
  const updateThumnailMutation = useUpdateThumbnailMutation();
  const [file, setFile] = useState();
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
        updateCategoryMutation.mutate(
          { ...values, categoryId },
          {
            onSuccess: () => {
              handleSuccess();
            },
            onError: error => handleError(error),
          }
        );
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
  const handleFileChange = (e, field) => {
    if (e.target.files.length) {
      const formData = new FormData();
      formData.append('thumbnailFile', e.target.files[0])
      updateThumnailMutation.mutate(
        formData,
        {
          onSuccess: (res) => {
            setFile(e.target.files[0].name)
            field.onChange(res?.data)
          },
        }
      )
    }
  }
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
        <AlertDialogContent maxW={'600px'} maxH={'400px'} >
          <AlertDialogHeader textTransform="uppercase">{categorysDetail ? 'Cập nhật' : 'Tạo'} Danh Mục</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody >
            <InputController control={control} name="title" label="Tên" />
            <InputController control={control} name="description" label="Mô tả" type='textarea' />
            <Controller
              control={control}
              name="thumbnail"
              render={({ field, fieldState: { error } }) => (
                <div className='z-0'>
                  <div className="file-upload mt-2">
                    <div className="file-select font-montserrat rounded-lg">
                      <div className="file-select-button" id="fileName">Chọn tệp</div>
                      <div className="file-select-name" id="noFile">{file ? file : `Không có tệp nào được chọn`}</div>
                      <input type="file" name="chooseFile" id="chooseFile" onChange={(e) => handleFileChange(e, field)} />
                    </div>

                  </div>
                  {error && <div className="text-danger mt-2">{error.message}</div>}
                </div>
              )}
            />
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