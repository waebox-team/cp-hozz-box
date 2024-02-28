import React from 'react';
import { Controller } from 'react-hook-form';
import { Box, Flex, FormControl, FormErrorMessage, FormLabel, Input as InputComponent, Textarea } from '@chakra-ui/react';

const InputController = ({
  type = 'text',
  hidden = false,
  readOnly = false,
  placeholder,
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
  requiredIndicator,
  ...props
}) => (
  <Controller
    name={name}
    control={control}
    render={({ field, fieldState: { error } }) => (
      <FormControl {...styleContainer} isRequired={isRequired} isInvalid={error && error?.message}>
        {label && (
          <FormLabel requiredIndicator={requiredIndicator} {...styleLabel} minW="150px">
            {label}
          </FormLabel>
        )}
        <Box {...styleBoxInput}>
          <Flex flexDirection="column">
            {type === 'textarea' ? (
              <Textarea
                {...field}
                {...props}
                className="form-control"
                type={type}
                disabled={disabled}
                placeholder={placeholder}
                onChange={e => {
                  onChange?.(e);
                  field.onChange(e);
                }}
              />
            ) : (
              <InputComponent
                {...field}
                {...props}
                readOnly={readOnly}
                hidden={hidden}
                type={type}
                disabled={disabled}
                onChange={e => {
                  onChange?.(e);
                  field.onChange(e);
                }}
              />
            )}
            <FormErrorMessage>{error && error?.message}</FormErrorMessage>
          </Flex>
          {extendsComponent && <Box>{extendsComponent}</Box>}
        </Box>
      </FormControl>
    )}
  />
);

export default InputController;
