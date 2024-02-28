import React, { useEffect, useState } from 'react';
import { Box, Flex, Button, FormControl, FormLabel, Switch, useColorModeValue } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';

import { useUserDispatch, loginUser } from 'context/UserContext';
import { CookieStorage } from 'utils/cookie-storage';
import InputController from '../../components/Form/InputController';
import { LoginFormValidate } from '../../utils/validation';
import { useLoginMutation } from '../../services/user';
import SignInImage from 'assets/img/signInImage.png';

function SignIn() {
  const [show, setShow] = useState({
    password: false,
  });
  const bgForm = useColorModeValue('white', 'navy.800');
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
          history.push('/admin/dashboard');
        },
      }
    );
  };

  return (
    <Flex position="relative">
      <Flex
        minH={{ md: '1000px' }}
        h={{ sm: 'initial', md: '75vh', lg: '85vh' }}
        w="100%"
        maxW="1044px"
        mx="auto"
        justifyContent="space-between"
        mb="30px"
        pt={{ md: '0px' }}
      >
        <Flex w="100%" h="100%" alignItems="center" justifyContent="center" mb="60px" mt={{ base: '50px', md: '20px' }}>
          <Flex
            zIndex="2"
            direction="column"
            w="445px"
            background="transparent"
            borderRadius="15px"
            p="40px"
            mx={{ base: '100px' }}
            m={{ base: '20px', md: 'auto' }}
            bg={bgForm}
            boxShadow={useColorModeValue('0px 5px 14px rgba(0, 0, 0, 0.05)', 'unset')}
          >
            <FormControl>
              <form>
                <InputController
                  control={control}
                  name="username"
                  label="Username"
                  isRequired
                  styleContainer={{ marginBottom: '15px' }}
                  styleBoxInput={{ flex: 1 }}
                />
                <InputController
                  control={control}
                  type={show.password ? 'text' : 'password'}
                  name="password"
                  label="Password"
                  isRequired
                  styleContainer={{ marginBottom: '15px' }}
                  styleBoxInput={{ flex: 1 }}
                  inputRightElement={
                    <Button
                      h="1.75rem"
                      size="sm"
                      onClick={() =>
                        setShow({
                          ...show,
                          password: !show.password,
                        })
                      }
                    >
                      {show.password ? 'Hide' : 'Show'}
                    </Button>
                  }
                />
              </form>

              <FormControl display="flex" alignItems="center" mb="24px">
                <Switch id="remember-login" colorScheme="blue" me="10px" />
                <FormLabel htmlFor="remember-login" mb="0" fontWeight="normal">
                  Remember me
                </FormLabel>
              </FormControl>
              <Button onClick={handleSubmit(onSubmit)} fontSize="10px" variant="dark" fontWeight="bold" w="100%" h="45" mb="24px">
                SIGN IN
              </Button>
            </FormControl>
          </Flex>
        </Flex>
        <Box overflowX="hidden" h="100%" w="100%" left="0px" position="absolute" bgImage={SignInImage}>
          <Box w="100%" h="100%" bgSize="cover" bg="blue.500" opacity="0.8"></Box>
        </Box>
      </Flex>
    </Flex>
  );
}

export default SignIn;
