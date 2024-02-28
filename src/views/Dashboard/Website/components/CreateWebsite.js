import React, { useMemo } from 'react';
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
  Tag,
  TagLabel,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import isEmpty from 'lodash/isEmpty';

import InputController from 'components/Form/InputController';
import SelectController from 'components/Form/SelectController';
import { useCreateWebsiteMutation, useUpdateWebsiteMutation } from 'services/website';
import { AdUnitsOptions, URL_REGEX } from 'constants/common';

const CreateWebsite = ({ isOpen, editWebsiteDetail, onClose, categories, refetch }) => {
  const cancelRef = React.useRef();
  const toast = useToast();
  const createWebsite = useCreateWebsiteMutation();
  const updateWebsite = useUpdateWebsiteMutation();

  const categoryEdit = useMemo(() => {
    return categories.find(item => item.value === editWebsiteDetail?.categoryId?._id);
  }, [categories, editWebsiteDetail?.categoryId]);

  const schema = yup.object().shape({
    name: yup.string().required('Vui lòng nhập tên'),
    url: yup.string().matches(URL_REGEX, 'Đường dẫn không hợp lệ').required('Vui lòng nhập đường dẫn'),
    adUnit: yup.object().nullable().required('Vui lòng chọn trạng thái'),
    categoryId: yup.object().nullable().required('Vui lòng chọn group'),
  });
  const { control, handleSubmit } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: editWebsiteDetail?.name || '',
      url: editWebsiteDetail?.url || '',
      adUnit:
        {
          label: editWebsiteDetail?.adUnit,
          value: editWebsiteDetail?.adUnit,
        } || undefined,
      categoryId: categoryEdit || undefined,
    },
  });

  const onSubmit = values => {
    if (!isEmpty(editWebsiteDetail)) {
      updateWebsite.mutate(
        {
          ...values,
          url: values?.url,
          categoryId: values?.categoryId?.value,
          adUnit: values?.adUnit?.value[0],
          websiteId: editWebsiteDetail?._id,
        },
        {
          onSuccess: () => {
            toast({
              title: 'Đã chỉnh sửa thành công.',
              status: 'success',
              duration: 9000,
              isClosable: true,
            });
            refetch();
            onClose();
          },
        }
      );
    } else {
      createWebsite.mutate(
        { ...values, url: values?.url, categoryId: values?.categoryId?.value, adUnit: values?.adUnit?.value },
        {
          onSuccess: () => {
            toast({
              title: 'Đã tạo thành công.',
              status: 'success',
              duration: 9000,
              isClosable: true,
            });
            refetch();
            onClose();
          },
        }
      );
    }
  };

  return (
    <>
      <AlertDialog motionPreset="slideInBottom" leastDestructiveRef={cancelRef} onClose={onClose} isOpen={isOpen} isCentered>
        <AlertDialogOverlay />

        <AlertDialogContent>
          <AlertDialogHeader textTransform="uppercase">Tạo thông tin Website</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>
            <form>
              <InputController control={control} name="name" label="Tên" isRequired />
              <InputController styleContainer={{ pt: '4' }} control={control} name="url" label="Đường dẫn" isRequired />
              <SelectController
                styleContainer={{ pt: '4' }}
                control={control}
                name="categoryId"
                label="Loại"
                isRequired
                options={categories}
              />
              {
              isEmpty(editWebsiteDetail) && 
              <SelectController
                styleContainer={{ pt: '4' }}
                control={control}
                name="adUnit"
                label="Ad units"
                placeholder="Chọn"
                isRequired
                options={AdUnitsOptions}
                extendsComponent={
                  !isEmpty(editWebsiteDetail) && (
                    <Tag borderRadius="full" variant="solid" colorScheme="blue">
                      <TagLabel lineHeight={'normal'}>{editWebsiteDetail?.adUnit?.length}</TagLabel>
                    </Tag>
                  )
                }
              />
              }
            </form>
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              Hủy
            </Button>
            <Button colorScheme="red" ml={3} onClick={handleSubmit(onSubmit)}>
              Tạo
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default CreateWebsite;
