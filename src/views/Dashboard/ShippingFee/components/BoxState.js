import { Button, FormControl, Text } from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import InputController from 'components/Form/InputController';
import SelectController from 'components/Form/SelectController';
import { toast } from 'components/Toast';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useStateTaxMutation } from 'services/shipping';
import { ShippingFeeFormValidate } from 'utils/validation';

function BoxState({dataState}) {
  const stateStateMutation = useStateTaxMutation();
  const { control, handleSubmit ,setValue} = useForm({
    resolver: yupResolver(ShippingFeeFormValidate),
    defaultValues: {
      name: '',
      fee: '',
    },
  });

  const hanldTax =  item => {
    stateStateMutation.mutate(
      { stateId: item.name.value, tax: item.fee },
      {
        onSuccess: () => {
          toast.showMessageSuccess(`Tạo Thuế thành công`);
        },
        onError: () => {
          toast.showMessageSuccess(`Tạo Thuế thất bại`);
        },
      }
    );
  
  };

  return (
    <FormControl minWidth={{ base: 'full', sm: '300px' }} flexBasis={{ base: '100%', md: '48%' }}>
    <SelectController
      name="name"
      control={control}
      label="Chọn Khu Vực"
      options={dataState?.data?.map(state => ({
        value: state._id,
        label: state.name,
      }))}
      onChange={async (selectedOption) => {
        const selectedCountry = dataState?.data.find(state => state._id === selectedOption.value);
        setValue('fee',selectedCountry?.tax)
      }}
    />
    <InputController control={control} type="number" label={'Phí vận chuyển'} placeholder={'123'} name="fee" />
    <Button variant="primary" maxH="40px" alignSelf={'end'} mt={'20px'} onClick={handleSubmit(hanldTax)}>
      <Text fontSize="md" fontWeight="bold" cursor="pointer">
        Lưu
      </Text>
    </Button>
  </FormControl>
  );
}

export default BoxState;

