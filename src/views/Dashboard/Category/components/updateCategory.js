import { Box, Button, Card, Flex, FormControl, FormLabel, Text, useColorModeValue } from '@chakra-ui/react';
import InputController from 'components/Form/InputController';
import { toast } from 'components/Toast';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useCreateCategoryMutation } from 'services/user';

function updateCategory() {
  const createCategoryMutation = useCreateCategoryMutation();
  const textColor = useColorModeValue('gray.700', 'white');

  const { handleSubmit, control, reset } = useForm({
    defaultValues: {
      title: '',
      description: '',
      id: '',
    },
  });

  const hanldCreateCategory = values => {
    createCategoryMutation.mutate(
      { ...values },
      {
        onSuccess: response => {
          toast.showMessageSuccess('Updated product catalog successfully.');
          reset({ title: '', description: '',id: '' });
        },
      }
    );
  };

  return (
    <Flex direction="column" pt={{ base: '120px', md: '75px', lg: '100px' }}>
      <Card p="16px" mb="24px" bg="#fff">
        <Text fontSize="xl" color={textColor} fontWeight="bold">
          Update Category
        </Text>
        <FormControl minWidth={{ base: 'full', sm: '300px' }} mt={'20px'}>
          <form>
            <InputController label={'Title'} name="title" control={control}  />
            <InputController
              label={'Description'}
              name="description"
              control={control}
              placeholder="Enter your description"
              type="textarea"
            />
            <InputController
              label={'Enter the category ID'}
              name="id"
              control={control}
            />
            <Button
              float={'right'}
              variant="primary"
              mt={'20px'}
              maxH="30px"
              px={8}
              py={8}
              fontSize={14}
              alignSelf={'end'}
              onClick={handleSubmit(hanldCreateCategory)}
            >
              Update Category
            </Button>
          </form>
        </FormControl>
      </Card>
    </Flex>
  );
}

export default updateCategory;
