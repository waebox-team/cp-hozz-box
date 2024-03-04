import React, { useState, useEffect, useRef } from 'react';
import { Button, FormLabel, FormControl, Flex, Text, Box, Grid, GridItem, IconButton, Image, Switch } from '@chakra-ui/react';
import { useFieldArray, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import isEmpty from 'lodash/isEmpty';
import omit from 'lodash/omit';
import { useHistory, useParams } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { nanoid } from 'nanoid';
import { BsUpload, BsXCircle } from 'react-icons/bs';
import { CloseIcon } from '@chakra-ui/icons';
import SelectController from 'components/Form/SelectController';
import InputController from 'components/Form/InputController';
import Card from 'components/Card/Card';
import CardBody from 'components/Card/CardBody';
import CardHeader from 'components/Card/CardHeader';
import {
  uploadPhotoProduct,
  useChangeStatusProductMutation,
  useCreateProductMutation,
  useGetColorForProdMutation,
  useGetSizeForProdMutation,
  useQueryGetCatForProduct,
  useQueryGetProductDetail,
  useUpdateProductMutation,
} from 'services/product';
import { mappingOptionSelect } from 'utils/mapping';
import { ProductFormValidate } from 'utils/validation';
import NumericInputController from 'components/Form/NumericInputController';
import { toast } from 'components/Toast';
import { ROOT_API } from 'constants/common';

export default function ProductForm() {
  const params = useParams();
  const { id } = params || {};
  const history = useHistory();
  const [categoryOption, setCategoryOption] = useState([]);
  const [sizeOption, setSizeOption] = useState([]);
  const [colorOption, setColorOption] = useState([]);
  const [error, setError] = useState({
    thumbnailFile: null,
  });
  const [files, setFiles] = useState([]);
  const [isDragEnter, setIsDragEnter] = useState(false);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': [],
    },
    onDragEnter: () => {
      setIsDragEnter(true);
    },
    onDragLeave: () => {
      setIsDragEnter(false);
    },
    onDrop: acceptedFiles => {
      setIsDragEnter(false);
      setError({ thumbnailFile: null });
      setFiles(prev => [
        ...prev,
        ...acceptedFiles.map(file => ({
          id: nanoid(),
          preview: URL.createObjectURL(file),
          file,
        })),
      ]);
    },
  });

  const { data: productDetailData, refetch } = useQueryGetProductDetail(id, {
    enabled: !!id,
  });
  const { data: categoriesData } = useQueryGetCatForProduct();
  const getSizeForProdMutation = useGetSizeForProdMutation();
  const getColorForProdMutation = useGetColorForProdMutation();
  const createProductMutation = useCreateProductMutation();
  const updateProductMutation = useUpdateProductMutation();
  const changeStatusProductMutation = useChangeStatusProductMutation();

  const { control, handleSubmit, reset, setValue } = useForm({
    resolver: yupResolver(ProductFormValidate),
    defaultValues: {
      name: '',
      price: '',
      description: '',
      sale: '',
      tags: '',
      category: undefined,
      size: undefined,
      colors: undefined,
      variants: [],
    },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'variants',
  });

  useEffect(() => {
    if (!isEmpty(categoriesData?.data)) {
      setCategoryOption(mappingOptionSelect(categoriesData?.data, 'title'));
    }
  }, [categoriesData?.data]);

  useEffect(() => {
    const productDetail = productDetailData?.data;
    const productVariants = productDetailData?.variants;
    const productColors = productDetailData?.colors;

    if (!isEmpty(productDetail)) {
      reset({
        name: productDetail.name,
        price: productDetail.price,
        sale: productDetail.sale,
        tags: productDetail.tags,
        description: productDetail.description,
        category: categoryOption?.find(item => item.value === productDetail.categoryId._id),
      });
      setFiles(
        productDetail.thumbnails.map(item => ({
          id: nanoid(),
          preview: ROOT_API + '/' + item,
          path: item,
        }))
      );
      handleSizeAndColorOption(productDetail.categoryId._id, productDetailData?.variants);
    }

    if (!isEmpty(productVariants)) {
      productVariants.map(item =>
        append({
          name: item.sizeId.name,
          sizeId: item.sizeId._id,
          price: item.price,
          count: item.count,
        })
      );
    }

    if (!isEmpty(productColors)) {
      setValue(
        'colors',
        productColors?.map(item => ({ label: item.colorId.name, value: item.colorId._id }))
      );
    }
  }, [productDetailData, categoryOption]);

  const handleSizeAndColorOption = (categoryId, sizesExists = []) => {
    getSizeForProdMutation.mutate(
      { data: { categoryId: categoryId } },
      {
        onSuccess: res => {
          const sizeAvailable = res?.data.filter(
            sizeItem => !sizesExists.some(sizeItemExists => sizeItem._id === sizeItemExists.sizeId._id)
          );

          setSizeOption(mappingOptionSelect(sizeAvailable, 'name'));
        },
      }
    );
    getColorForProdMutation.mutate(
      { data: { categoryId: categoryId } },
      {
        onSuccess: res => {
          setColorOption(mappingOptionSelect(res?.data, 'name'));
        },
      }
    );
  };

  const handleCategorySelect = e => {
    if (!e) {
      setSizeOption([]);
      setColorOption([]);
      setValue('size', 'undefined');
      setValue('color', 'undefined');
      return;
    }

    handleSizeAndColorOption(e.value);
  };

  const handleSizeSelect = e => {
    setSizeOption(sizeOption.filter(item => item.value !== e.value));
    append({ name: e.label, sizeId: e.value, price: '', count: '' });
  };

  const onUploadPhoto = async () => {
    const formData = new FormData();
    const filesUpload = files.filter(item => item.file);
    const filesExist = files.filter(item => !item.file).map(item => item.path);
    let pathFiles = [];

    if (!isEmpty(filesUpload)) {
      filesUpload.map(item => {
        formData.append('thumbnailFiles', item.file);
      });

      const response = await uploadPhotoProduct(formData);

      pathFiles = response?.data;
    }

    return [...filesExist, ...pathFiles];
  };

  const onSubmit = async dataForm => {
    if (isEmpty(files)) {
      setError({ thumbnailFile: 'Tải lên ít nhất 1 hình ảnh' });
      return;
    }

    const photosPath = await onUploadPhoto();

    const dataSubmit = omit(
      {
        ...dataForm,
        categoryId: dataForm.category?.value,
        colors: dataForm.colors?.map(item => item.value),
        thumbnails: photosPath,
      },
      ['category', 'size']
    );

    if (!!id) {
      updateProductMutation.mutate(
        { ...dataSubmit, id },
        {
          onSuccess: () => {
            refetch();
            toast.showMessageSuccess('Cập nhập sản phẩm thành công');
          },
          onError: () => {
            toast.showMessageError('Cập nhập sản phẩm thất bại');
          },
        }
      );

      return;
    }

    createProductMutation.mutate(dataSubmit, {
      onSuccess: () => {
        toast.showMessageSuccess('Tạo sản phẩm thành công');
        history.push('/admin/product');
      },
      onError: () => {
        toast.showMessageError('Tạo sản phẩm thất bại');
      },
    });
  };

  const onRemove = index => {
    setFiles(prev => prev.filter((i, idX) => idX !== index));
  };

  const handlePublicProduct = () => {
    changeStatusProductMutation.mutate(
      { id },
      {
        onSuccess: () => {
          toast.showMessageSuccess(`Phát hành sản phẩm thành công`);
          refetch?.();
        },
        onError: () => {
          toast.showMessageError(`Phát hành sản phẩm thất bại`);
          refetch?.();
        },
      }
    );
  };

  return (
    <Flex direction="column" pt={{ base: '120px', md: '75px' }}>
      <Card overflowX={{ sm: 'scroll', xl: 'hidden' }} pb="0px" bg="white">
        <CardHeader p="6px 0px 22px 0px">
          <Flex alignItems="center" justifyContent="space-between">
            <Text fontSize="xl" fontWeight="bold">
              {`${id ? 'Cập nhập' : 'Tạo'} sản phẩm`}
            </Text>
            {!!id && (
              <Flex flexDirection="column" alignItems="center" gap={1}>
                <Text>Phát hành</Text>
                <Switch size="md" isChecked={productDetailData?.data?.isPublished} onChange={handlePublicProduct} />
              </Flex>
            )}
          </Flex>
        </CardHeader>
        <CardBody pb={4}>
          <form>
            <InputController control={control} name="name" label="Tên" isRequired styleContainer={{ pt: '4' }} />
            <NumericInputController control={control} name="price" label="Giá" isRequired styleContainer={{ pt: '4' }} />
            <NumericInputController control={control} name="sale" label="Khuyến mãi" styleContainer={{ pt: '4' }} />
            <InputController control={control} name="tags" label="Tags" styleContainer={{ pt: '4' }} />
            <InputController type="textarea" control={control} name="description" label="Mô tả" styleContainer={{ pt: '4' }} />
            <SelectController
              styleContainer={{ pt: '4' }}
              control={control}
              isRequired
              name="category"
              label="Loại"
              isClearable
              options={categoryOption}
              onChange={handleCategorySelect}
            />
            <SelectController
              styleContainer={{ pt: '4' }}
              control={control}
              isRequired
              name="size"
              label="Kích thước"
              options={sizeOption}
              onChange={handleSizeSelect}
            />
            {!isEmpty(fields) && (
              <Box borderWidth="1px" borderStyle="dashed" borderRadius="12px" padding="16px" mt={4}>
                {fields.map((field, index) => {
                  return (
                    <Flex key={index} gap={4} alignItems="center" mb={2}>
                      <Text minW="50px">{field?.name}</Text>
                      <NumericInputController control={control} name={`variants.${index}.count`} label="Số lượng" isRequired />
                      <NumericInputController control={control} name={`variants.${index}.price`} label="Giá" isRequired />
                      <IconButton
                        onClick={() => {
                          remove(index);
                          setSizeOption([...sizeOption, { label: field.name, value: field.sizeId }]);
                        }}
                      >
                        <CloseIcon boxSize={3} />
                      </IconButton>
                    </Flex>
                  );
                })}
              </Box>
            )}
            <SelectController
              styleContainer={{ pt: '4' }}
              isMulti
              control={control}
              isRequired
              name="colors"
              label="Màu"
              options={colorOption}
            />
            <FormControl pt={4}>
              <FormLabel minW="150px">Ảnh</FormLabel>
              <Box
                {...getRootProps()}
                cursor="pointer"
                borderWidth="1px"
                borderStyle="dashed"
                borderRadius="12px"
                padding="55px"
                textAlign="center"
                height="210px"
                display="flex"
                flexDirection="column"
                alignItems="center"
              >
                <input {...getInputProps()} />
                <BsUpload size={40} />
                {isDragEnter ? (
                  <p>Thả ảnh của bạn</p>
                ) : (
                  <>
                    <p>
                      <Text as="span" color="red.400">
                        Tải tập tin lên
                      </Text>
                      &nbsp;hoặc kéo và thả
                    </p>
                  </>
                )}
              </Box>
              <Grid templateColumns="repeat(5, 1fr)" gap={6} pt={5}>
                {files?.map((file, index) => (
                  <GridItem w={'100%'} key={file.id} position="relative">
                    <Image src={file.preview} w="full" h="full" objectFit="contain" />
                    <IconButton bg="transparent" position="absolute" top="0" right="0" onClick={() => onRemove(index)}>
                      <BsXCircle size={16} color="red" />
                    </IconButton>
                  </GridItem>
                ))}
              </Grid>
              {!!error.thumbnailFile && (
                <Text pt={1} color={'red.500'} fontSize="13px">
                  {error.thumbnailFile}
                </Text>
              )}
            </FormControl>
          </form>
          <Flex pt={6} alignItems="flex-end" justifyContent="flex-end">
            <Button
              onClick={() => {
                history.goBack();
              }}
            >
              Hủy
            </Button>
            <Button
              colorScheme="blue"
              ml={3}
              isLoading={createProductMutation.isPending || updateProductMutation.isPending}
              onClick={handleSubmit(onSubmit)}
            >
              {!!id ? 'Cập nhập ' : 'Tạo'}
            </Button>
          </Flex>
        </CardBody>
      </Card>
    </Flex>
  );
}
