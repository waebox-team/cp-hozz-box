import React from 'react';
import { Box, Button, Checkbox, Grid, GridItem, Heading, Link, Text } from '@chakra-ui/react';
import { useHistory, Link as LinkRoute, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import queryString from 'query-string';

import InputController from 'components/Form/InputController';
import SelectController from 'components/Form/SelectController';
import { ContactChannelOptions } from 'constants/common';
import { useRegisterMutation } from 'services/user';
import { toast } from 'components/Toast';
import { RegisterFormValidate } from 'utils/validation';

function SignUp() {
  const history = useHistory();
  const registerMutation = useRegisterMutation();
  const { search } = useLocation();
  const params = queryString.parse(search);

  const { control, handleSubmit } = useForm({
    resolver: yupResolver(RegisterFormValidate),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      passwordConf: '',
      contactChannel: undefined,
      contactUsername: '',
      countryCode: undefined,
      phone: '',
    },
  });

  const onSubmit = values => {
    registerMutation.mutate(
      { ...values, countryCode: values?.countryCode?.value, contactChannel: values?.contactChannel?.value, referralBy: params?.ref },
      {
        onSuccess: () => {
          toast.showMessageSuccess('Đăng ký tài khoản thành công.');
          history.push('/sign-in');
        },
      }
    );
  };

  return (
    <Box minH="100vh">
      <div>
        <Grid templateColumns="repeat(12, 1fr)" gap={{ base: '0', lg: '40px' }}>
          <GridItem w="100%" colSpan={{ base: '12', lg: '6' }} paddingLeft="40px" paddingRight="40px">
            <Box marginY="10%">
              <Heading as="h3" textAlign="center" fontSize="24px" marginTop="20px" marginBottom="40px">
                Đăng kí tài khoản Publisher
              </Heading>
              <form>
                <InputController
                  control={control}
                  name="email"
                  label="Email"
                  isRequired
                  styleContainer={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}
                  styleBoxInput={{ flex: 1 }}
                />
                <InputController
                  control={control}
                  name="username"
                  label="Tên đăng nhập"
                  isRequired
                  styleContainer={{ display: 'flex', alignItems: 'start', marginBottom: '15px' }}
                  styleBoxInput={{ flex: 1 }}
                  styleLabel={{ marginTop: '10px' }}
                  extendsComponent={
                    <Box marginTop="6px">
                      <Text fontSize="13px">Tối thiểu 6 kí tự.</Text>
                      <Text fontSize="13px">Chỉ bao gồm chữ thường, số và dấu chấm ".".</Text>
                      <Text fontSize="13px">Không bắt đầu và kết thúc bằng dấu chấm.</Text>
                    </Box>
                  }
                />
                <InputController
                  control={control}
                  type="password"
                  name="password"
                  label="Mật khẩu"
                  isRequired
                  styleContainer={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}
                  styleBoxInput={{ flex: 1 }}
                />
                <InputController
                  control={control}
                  type="password"
                  name="passwordConf"
                  label="Xác nhận mật khẩu"
                  isRequired
                  styleContainer={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}
                  styleBoxInput={{ flex: 1 }}
                />
                <SelectController
                  control={control}
                  name="contactChannel"
                  label="Kênh liên lạc"
                  options={ContactChannelOptions}
                  isRequired
                  styleContainer={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}
                  styleBoxInput={{ flex: 1 }}
                />
                <InputController
                  control={control}
                  name="contactUsername"
                  label="Tài khoản liên lạc"
                  isRequired
                  styleContainer={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}
                  styleBoxInput={{ flex: 1 }}
                />
              </form>
              <Box textAlign="center" paddingX="24px">
                <Checkbox fontSize="12px">
                  Tôi đồng ý với các điều khoản trong
                  <Link href="#" target="_blank" color="#337ab7">
                    &nbsp;Thoả thuận sử dụng
                  </Link>
                  &nbsp;và&nbsp;
                  <Link href="#" target="_blank" color="#337ab7">
                    Chính sách bảo vệ dữ liệu cá nhân.
                  </Link>
                </Checkbox>
              </Box>
              <Box paddingTop="15px">
                <Button colorScheme="blue" w="100%" onClick={handleSubmit(onSubmit)}>
                  Đăng ký
                </Button>
              </Box>
              <Box paddingY="15px" textAlign="center">
                Bạn đã có tài khoản&nbsp;
                <LinkRoute to="/auth/sign-in" style={{ color: '#337ab7' }}>
                  Đăng nhập
                </LinkRoute>
              </Box>
            </Box>
          </GridItem>
          <GridItem
            w="100%"
            display={{ base: 'none', lg: 'block' }}
            colSpan={{ base: '7', md: '6' }}
            paddingLeft="40px"
            paddingRight="40px"
          >
            Image
          </GridItem>
        </Grid>
      </div>
    </Box>
  );
}

export default SignUp;
