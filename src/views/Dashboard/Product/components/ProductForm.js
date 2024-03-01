import React, { useState, useEffect, useRef } from 'react';
import { Button, FormLabel, FormControl, Flex, Text, Box, Grid, GridItem, IconButton } from '@chakra-ui/react';
import { useFieldArray, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import isEmpty from 'lodash/isEmpty';
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
  createProduct,
  uploadPhotoProduct,
  useCreateProductMutation,
  useGetColorForProdMutation,
  useGetSizeForProdMutation,
  useQueryGetCatForProduct,
} from 'services/product';
import { mappingOptionSelect } from 'utils/mapping';
import { ProductFormValidate } from 'utils/validation';
import NumericInputController from 'components/Form/NumericInputController';
import { omit } from 'lodash';
import { toast } from 'components/Toast';

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
        ...acceptedFiles.map(file => ({
          id: nanoid(),
          preview: URL.createObjectURL(file),
          file,
        })),
        ...prev,
      ]);
    },
  });

  const { data: categoriesData } = useQueryGetCatForProduct();
  const getSizeForProdMutation = useGetSizeForProdMutation();
  const getColorForProdMutation = useGetColorForProdMutation();
  const createProductMutation = useCreateProductMutation();

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
      color: undefined,
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

  const handleCategorySelect = e => {
    if (!e) {
      setSizeOption([]);
      setColorOption([]);
      setValue('size', 'undefined');
      setValue('color', 'undefined');
      return;
    }

    getSizeForProdMutation.mutate(
      { data: { categoryId: e.value } },
      {
        onSuccess: res => {
          setSizeOption(mappingOptionSelect(res?.data, 'name'));
        },
      }
    );
    getColorForProdMutation.mutate(
      { data: { categoryId: e.value } },
      {
        onSuccess: res => {
          setColorOption(mappingOptionSelect(res?.data, 'name'));
        },
      }
    );
  };

  const handleSizeSelect = e => {
    setSizeOption(sizeOption.filter(item => item.value !== e.value));
    append({ name: e.label, sizeId: e.value, price: '', count: '' });
  };

  const onUploadPhoto = async () => {
    const formData = new FormData();

    files.map(item => {
      formData.append('thumbnailFiles', item.file);
    });

    const response = await uploadPhotoProduct(formData);

    return response?.data;
  };

  const onSubmit = async dataForm => {
    if (isEmpty(files)) {
      setError({ thumbnailFile: 'Tải lên ít nhất 1 hình ảnh' });
      return;
    }

    const photosPath = await onUploadPhoto();

    createProductMutation.mutate(
      omit(
        {
          ...dataForm,
          categoryId: dataForm.category?.value,
          color: dataForm.color?.map(item => item.value),
          thumbnails: photosPath,
        },
        ['category', 'size']
      ),
      {
        onSuccess: () => {
          toast.showMessageSuccess('Tạo sản phẩm thành công');
        },
        onError: () => {
          toast.showMessageError('Tạo sản phẩm thất bại');
        },
      }
    );
  };

  const onRemove = index => {
    setFiles(prev => prev.filter((i, idX) => idX !== index));
  };

  return (
    <Flex direction="column" pt={{ base: '120px', md: '75px' }}>
      <Card overflowX={{ sm: 'scroll', xl: 'hidden' }} pb="0px" bg="white">
        {/* <CardHeader p="6px 0px 22px 0px">
          <Flex justifyContent="space-between">
            <Text fontSize="xl" color={textColor} fontWeight="bold">
              {`${id ? 'Edit' : 'Create'} Post`}
            </Text>
            <Switch size="md" isChecked={isPublic} onChange={e => handlePublicPost(e.target.checked)} />
          </Flex>
        </CardHeader> */}
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
              menuPlacement="top"
              control={control}
              isRequired
              name="color"
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
                    <img src={file.preview} className="w-full h-full object-contain" />
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
            <Button colorScheme="blue" ml={3} isLoading={createProductMutation.isPending} onClick={handleSubmit(onSubmit)}>
              Tạo
            </Button>
          </Flex>
        </CardBody>
      </Card>
    </Flex>
  );
}
