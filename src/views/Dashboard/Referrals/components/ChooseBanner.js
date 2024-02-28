import {
  Button,
  Card,
  CardHeader,
  Flex,
  Grid,
  GridItem,
  Image,
  Input,
  Radio,
  RadioGroup,
  Stack,
  Text,
  useClipboard,
  useColorModeValue,
} from '@chakra-ui/react';
import { Select } from 'chakra-react-select';
import { toast } from 'components/Toast';
import { ROOT_API } from 'constants/common';
import React, { useState } from 'react';

const optionsSize = type => {
  return [
    {
      label: `${type} 120x60 px`,
      value: {
        height: 60,
        width: 120,
      },
    },
    {
      label: `${type} 120x150 px`,
      value: {
        height: 150,
        width: 120,
      },
    },
    {
      label: `${type} 300x250 px`,
      value: {
        height: 250,
        width: 300,
      },
    },
    {
      label: `${type} 600x250 px`,
      value: {
        height: 250,
        width: 600,
      },
    },
    {
      label: `${type} 700x90 px`,
      value: {
        height: 90,
        width: 700,
      },
    },
    {
      label: `${type} 720x90 px`,
      value: {
        height: 90,
        width: 720,
      },
    },
  ];
};

function ChooseBanner({ informationBanner }) {
  const textColor = useColorModeValue('gray.700', 'white');
  const [size, setSize] = useState({
    label: `PNG 120x60 px`,
    value: {
      height: 60,
      width: 120,
    },
  });
  const [typeBanner, setTypeBanner] = useState('PNG');
  const { onCopy, value, hasCopied } = useClipboard(
    `<a href=""><img alt="banner" src="${ROOT_API}/${typeBanner === 'PNG' ? informationBanner?.pngRef : informationBanner?.gifRef}" /></a>`
  );

  const handleClickCopy = () => {
    onCopy();
    hasCopied && toast.showMessageSuccess('Copied.');
  };

  return (
    <Card p="16px" mb="24px" bg="#fff" borderRadius={'20px'}>
      <CardHeader p="12px 5px" mb="12px">
        <Flex direction="column">
          <Text fontSize="x-large" color={textColor} fontWeight="bold" textAlign={'center'}>
            Referral Link
          </Text>
          <Text marginTop={'40px'}>
            Download the banners that suit you the most or copy them in code. Both static and animated versions are available.
          </Text>
        </Flex>
        <Grid templateColumns="repeat(2, 1fr)" gap={4} marginTop={'40px'}>
          <GridItem>
            <RadioGroup defaultValue={typeBanner} onChange={e => setTypeBanner(e)}>
              <Stack spacing={5} direction="row">
                <Radio value="PNG">PNG</Radio>
                <Radio value="GIF">GIF</Radio>
              </Stack>
            </RadioGroup>
            <Select
              variant="flushed"
              options={optionsSize(typeBanner)}
              placeholder={'Select size'}
              onChange={e => {
                setSize(e);
              }}
            />
            <Button mt={5} width={'100%'} colorScheme="blue" onClick={() => {}}>
              Download banner
            </Button>
            <Input mt={8} cursor={'copy'} readOnly value={value} mr={2} onClick={handleClickCopy} />
          </GridItem>
          <GridItem minHeight={'400px'}>
            <Image
              objectFit={'cover'}
              height={size.value.height}
              width={size.value.width}
              src={`${ROOT_API}/${typeBanner === 'PNG' ? informationBanner?.pngRef : informationBanner?.gifRef}`}
              alt="banner"
            />
          </GridItem>
        </Grid>
      </CardHeader>
    </Card>
  );
}

export default ChooseBanner;
