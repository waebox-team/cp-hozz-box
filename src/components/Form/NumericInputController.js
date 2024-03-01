import { Controller } from 'react-hook-form';
import { NumberInput, NumberInputField, Box, Flex, FormControl, FormErrorMessage, FormLabel } from '@chakra-ui/react';

const NumericInputController = ({
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
  inputRightElement,
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
            <NumberInput
              {...field}
              {...props}
              readOnly={readOnly}
              hidden={hidden}
              disabled={disabled}
              onChange={e => {
                onChange?.(e);
                field.onChange(e);
              }}
            >
              <NumberInputField />
            </NumberInput>
            <FormErrorMessage>{error && error?.message}</FormErrorMessage>
          </Flex>
          {extendsComponent && <Box>{extendsComponent}</Box>}
        </Box>
      </FormControl>
    )}
  />
);

export default NumericInputController;
