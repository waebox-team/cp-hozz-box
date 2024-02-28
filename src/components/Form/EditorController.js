import React from 'react';
import { Controller } from 'react-hook-form';
import { Box, FormControl, FormErrorMessage, FormLabel } from '@chakra-ui/react';
import Editor from 'components/Editor/Editor';

const EditorController = ({ name, label, control, styleContainer, styleBoxInput, isRequired, onChange }) => (
  <Controller
    name={name}
    control={control}
    render={({ field, fieldState: { error } }) => (
      <FormControl {...styleContainer} isRequired={isRequired} isInvalid={error && error?.message}>
        {label && <FormLabel minW="150px">{label}</FormLabel>}
        <Box {...styleBoxInput}>
          <Editor {...field} onEditorChange={field.onChange} />
          <FormErrorMessage>{error && error?.message}</FormErrorMessage>
        </Box>
      </FormControl>
    )}
  />
);

export default EditorController;
