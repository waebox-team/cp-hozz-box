import { createStandaloneToast } from '@chakra-ui/react';
import { ToastStatus } from 'constants/common';

const toastChakra = createStandaloneToast();

export const toast = {
  showMessageSuccess: message => {
    toastChakra.toast({
      position: 'top',
      title: message,
      status: ToastStatus.Success,
      duration: 5000,
      isClosable: true,
    });
  },
  showMessageError: message => {
    toastChakra.toast({
      position: 'top',
      title: message,
      status: ToastStatus.Error,
      duration: 5000,
      isClosable: true,
    });
  },
};
