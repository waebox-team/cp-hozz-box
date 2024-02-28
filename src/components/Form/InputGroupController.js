import React from 'react';
import { Controller } from 'react-hook-form';
import { Box, Flex, FormControl, FormErrorMessage, FormLabel, Input as InputComponent, InputGroup, InputLeftAddon, InputRightAddon } from '@chakra-ui/react';

const InputGroupController = ({
    type = 'text',
    name,
    label,
    control,
    styleContainer,
    styleBoxInput,
    styleLabel,
    isRequired,
    disabled,
    extendsComponent,
    onChange,
}) => (
    <Controller
        name={name}
        control={control}
        render={({ field, fieldState: { error } }) => (
            <FormControl {...styleContainer} isRequired={isRequired} isInvalid={error && error?.message}>
                {label && (
                    <FormLabel {...styleLabel} minW="150px">
                        {label}
                    </FormLabel>
                )}
                <Box {...styleBoxInput}>
                    <Flex flexDirection="column">
                        <InputGroup>
                            <InputLeftAddon>
                                https://
                            </InputLeftAddon>
                            <InputComponent
                                {...field}
                                type={type}
                                disabled={disabled}
                                onChange={e => {
                                    onChange?.(e);
                                    field.onChange(e);
                                }}
                            />
                            <InputRightAddon>
                                .com
                            </InputRightAddon>
                        </InputGroup>

                        <FormErrorMessage>{error && error?.message}</FormErrorMessage>
                    </Flex>
                    {extendsComponent && <Box>{extendsComponent}</Box>}
                </Box>
            </FormControl>
        )}
    />
);

export default InputGroupController;
