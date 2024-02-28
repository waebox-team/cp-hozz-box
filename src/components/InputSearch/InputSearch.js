import { CloseIcon, SearchIcon } from '@chakra-ui/icons';
import { FormControl, Input, InputGroup, InputLeftElement, InputRightElement } from '@chakra-ui/react';

const InputSearch = ({ value, onChange, onClearSearch }) => {
  return (
    <FormControl display="flex" alignItems="center" maxW="300px" mr="12px">
      <InputGroup>
        <InputLeftElement pointerEvents="none">
          <SearchIcon />
        </InputLeftElement>
        <Input placeholder="Tìm kiếm" value={value} onChange={onChange} />
        {value && (
          <InputRightElement>
            <CloseIcon w="12px" h="12px" _hover={{ cursor: 'pointer' }} onClick={onClearSearch} />
          </InputRightElement>
        )}
      </InputGroup>
    </FormControl>
  );
};

export default InputSearch;
