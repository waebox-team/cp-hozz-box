import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Flex, Text, useColorMode, useColorModeValue } from "@chakra-ui/react";
import isEmpty from "lodash/isEmpty";
import InputController from "components/Form/InputController";
import { ChangePasswordFormValidate } from "utils/validation";
import { useChangePasswordMutation } from "services/user";
import { toast } from "components/Toast";

function ChangePassword() {
    const changePassword = useChangePasswordMutation()
    const { colorMode } = useColorMode();
    const textColor = useColorModeValue('white', 'white');

    const { control, handleSubmit } = useForm({
        resolver: yupResolver(ChangePasswordFormValidate),
    })

    const onSubmit = values => {
        if (!isEmpty(values)) {
            changePassword.mutate(values, {
                onSuccess: () => {
                    toast.showMessageSuccess("Changed password.");
                },
            })
        }
    };

    return (
        <>
            <form>
                <InputController
                    control={control}
                    type="password"
                    name="password"
                    label="Old Password"
                    isRequired
                    styleContainer={{ display: 'flex', flexDirection: "column", alignItems: 'start', marginBottom: '15px' }}
                    styleBoxInput={{ flex: 1, width: "100%" }}
                />
                <InputController
                    control={control}
                    type="password"
                    name="newPassword"
                    label="New Password"
                    isRequired
                    styleContainer={{ display: 'flex', flexDirection: "column", alignItems: 'start', marginBottom: '15px' }}
                    styleBoxInput={{ flex: 1, width: "100%" }}
                />
                <InputController
                    control={control}
                    type="password"
                    name="passwordConf"
                    label="Re-Enter New Password"
                    isRequired
                    styleContainer={{ display: 'flex', flexDirection: "column", alignItems: 'start', marginBottom: '15px' }}
                    styleBoxInput={{ flex: 1, width: "100%" }}
                />
            </form>
            <Button p="0px" bg="transparent" variant="no-effects">
                <Flex
                    align="center"
                    w={{ sm: '100%', lg: '135px' }}
                    bg={colorMode === 'dark' ? 'navy.900' : 'blue.500'}
                    borderRadius="8px"
                    justifyContent="center"
                    py="10px"
                    boxShadow="2px 2px 5.5px rgba(0, 0, 0, 0.06)"
                    cursor="pointer"
                    onClick={handleSubmit(onSubmit)}
                >
                    <Text fontSize="sm" color={textColor} fontWeight="bold">
                        Change Password
                    </Text>
                </Flex>
            </Button>
        </>
    )
}

export default ChangePassword