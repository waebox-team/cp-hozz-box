import { Card, CardHeader, Flex, Text, useColorModeValue } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import {
  useGetCountryByCodeMutation,
  useGetStateByCountryMutation,
  useQueryGetCountry,
  useCreateShippingFeeMutation,
} from 'services/shipping';
import { CookieStorage } from 'utils/cookie-storage';
import { useHistory } from 'react-router-dom';
import { toast } from 'components/Toast';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import BoxState from './components/BoxState';
import { ShippingFeeFormValidate } from 'utils/validation';
import ShippingForm from './components/ShippingForm';
const isLoggedIn = CookieStorage.isAuthenticated();

function ShippingFee() {
  const textColor = useColorModeValue('gray.700', 'white');
  const history = useHistory();
  const { data: queryCountry } = useQueryGetCountry();
  const getCountryByCodeMutation = useGetCountryByCodeMutation();
  const setShippingFeeMutation = useCreateShippingFeeMutation();
  const getState = useGetStateByCountryMutation();
  const [dataState, setDataState] = useState(null);
  useEffect(() => {
    if (!isLoggedIn) {
      return history.push('/auth/sign-in');
    }
  }, [isLoggedIn, history]);

  const { control, handleSubmit ,setValue } = useForm({
    resolver: yupResolver(ShippingFeeFormValidate),
    defaultValues: {
      name: '',
      fee:'',
    },
  });

  const handleSearch = async item => {
    setShippingFeeMutation.mutate(
      { code: item.name.value, fee: item.fee },
      {
        onSuccess: () => {
          toast.showMessageSuccess(`Tạo phí thành công`);
        },
        onError: () => {
          toast.showMessageSuccess(`Tạo phí thất bại`);
        }
      }
    );
  };

  return (
    <Flex direction="column" pt={{ base: '120px', md: '75px', lg: '100px' }}>
      <Card p="16px" mb="24px" bg="#fff">
        <CardHeader p="12px 5px" mb="12px">
          <Flex justifyContent={'space-between'}>
            <Flex direction={'column'}>
              <Flex direction="column" gap={'30px'}>
                <Text fontSize="xl" color={textColor} fontWeight="bold">
                  Phí Vận Chuyển
                </Text>
              </Flex>
              <Flex justifyContent={'space-between'} alignItems={'end'} gap={'20px'} mt={'20px'} flexWrap={{ base: 'wrap', md: 'nowrap' }}>
                <ShippingForm
                  control={control}
                  queryCountry={queryCountry}
                  getState={getState}
                  getCountryByCodeMutation={getCountryByCodeMutation}
                  setValue={setValue}
                  handleSubmit={handleSubmit}
                  handleSearch={handleSearch}
                  setDataState={setDataState}
                />
                <BoxState dataState={dataState}/>
              </Flex>
            </Flex>
          </Flex>
        </CardHeader>
      </Card>
    </Flex>
  );
}

export default ShippingFee;
