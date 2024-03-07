import React from 'react';
import { FormControl, Button, Text } from '@chakra-ui/react';
import SelectController from 'components/Form/SelectController';
import InputController from 'components/Form/InputController';

const ShippingForm = ({ control, queryCountry, getState, getCountryByCodeMutation, setValue, handleSubmit, handleSearch, setDataState }) => {
  return (
    <FormControl minWidth={{ base: 'full', sm: '300px' }} flexBasis={{ base: '100%', md: '48%' }}>
      <SelectController
        name="name"
        control={control}
        label="Chọn Quốc Gia"
        options={queryCountry?.data?.map(country => ({
          value: country.code,
          label: country.name,
        }))}
        onChange={async (selectedOption) => {
          const selectedCountry = queryCountry?.data.find(country => country.code === selectedOption.value);
          setDataState(await getState.mutateAsync(selectedCountry?.code));
          const dataValueShipping = await getCountryByCodeMutation.mutateAsync(selectedOption.value)
          setValue('fee', dataValueShipping?.data?.shippingFee)
        }}
      />
      <InputController control={control} type="number" label={'Phí vận chuyển'} name="fee" />
      <Button variant="primary" maxH="40px" alignSelf={'end'} mt={'20px'} onClick={handleSubmit(handleSearch)}>
        <Text fontSize="md" fontWeight="bold" cursor="pointer">
          Lưu
        </Text>
      </Button>
    </FormControl>
  );
}

export default ShippingForm;
