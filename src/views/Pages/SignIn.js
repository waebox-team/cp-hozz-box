import React, { useEffect } from 'react';
import { Box, Button, Flex, Grid, GridItem, Link, Text } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useHistory, Link as LinkRoute } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';

import { useUserDispatch, loginUser } from 'context/UserContext';
import { CookieStorage } from 'utils/cookie-storage';
import InputController from '../../components/Form/InputController';
import { LoginFormValidate } from '../../utils/validation';
import { useLoginMutation } from '../../services/user';
import { ADVERTISER_PAGE_URL } from 'constants/common';

function SignIn() {
  const userDispatch = useUserDispatch();
  const history = useHistory();
  const loginMutation = useLoginMutation();
  const isLoggedIn = CookieStorage.isAuthenticated();

  const { control, handleSubmit } = useForm({
    resolver: yupResolver(LoginFormValidate),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  useEffect(() => {
    if (isLoggedIn) {
      return history.push('/admin');
    }
  }, [isLoggedIn]);

  const onSubmit = values => {
    loginMutation.mutate(
      { ...values },
      {
        onSuccess: response => {
          const { data, token } = response || {};

          loginUser(userDispatch, token, data);
          history.push('/admin/statistics');
        },
      }
    );
  };

  return (
    <Box minH="100vh">
      <div>
        <Grid templateColumns="repeat(12, 1fr)" gap={{ base: '0', lg: '40px' }}>
          <GridItem w="100%" colSpan={{ base: '12', lg: '6' }} paddingLeft="40px" paddingRight="40px">
            <Box marginY="10%" paddingX={{ base: '0', lg: '120px' }}>
              <Flex justifyContent="center" alignItems="center" mb="30px">
                <Link
                  href={ADVERTISER_PAGE_URL}
                  paddingX="12px"
                  paddingY="6px"
                  border="1px"
                  borderColor="#ccc"
                  bgColor="#fff"
                  textColor="#333"
                  borderTopLeftRadius="4px"
                  borderBottomLeftRadius="4px"
                >
                  Advertiser
                </Link>
                <Box
                  paddingX="12px"
                  paddingY="6px"
                  border="1px"
                  borderColor="#2c6ccd"
                  bgColor="#2c6ccd"
                  textColor="white"
                  borderTopRightRadius="4px"
                  borderBottomRightRadius="4px"
                >
                  Publisher
                </Box>
              </Flex>
              <form>
                <InputController
                  control={control}
                  name="username"
                  label="Tên đăng nhập"
                  isRequired
                  styleContainer={{ marginBottom: '15px' }}
                  styleBoxInput={{ flex: 1 }}
                />
                <InputController
                  control={control}
                  type="password"
                  name="password"
                  label="Mật khẩu"
                  isRequired
                  styleContainer={{ marginBottom: '15px' }}
                  styleBoxInput={{ flex: 1 }}
                />
              </form>
              <Flex justifyContent="end">
                <Text color="#337ab7" cursor="pointer">
                  Quên mật khẩu?
                </Text>
              </Flex>
              <Box paddingTop="15px" textAlign="center">
                <Button colorScheme="blue" w="100%" onClick={handleSubmit(onSubmit)}>
                  Đăng nhập
                </Button>
              </Box>
              <Box paddingY="15px" textAlign="center">
                Bạn chưa có tài khoản&nbsp;
                <LinkRoute to="/auth/sign-up" style={{ color: '#337ab7' }}>
                  Đăng ký
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

export default SignIn;
