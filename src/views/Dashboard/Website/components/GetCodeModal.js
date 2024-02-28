import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  Flex,
  Text,
  useClipboard,
} from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import SelectController from 'components/Form/SelectController';
import { AVAILABLE_AD_UNITS, DIRECTION, FontSizeOptions, WidgetLayoutOptions } from 'constants/common';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { TbWorld } from 'react-icons/tb';
import { CopyIcon } from '@chakra-ui/icons';
import { BsWindowFullscreen } from 'react-icons/bs';
import InputController from 'components/Form/InputController';
import { toast } from 'components/Toast';
import { GetCodeNativeFormValidate } from 'utils/validation';
import { useSaveNativeBannerMutation } from 'services/website';

const CreateScreenGenerator = ({ numberOfDivs, direction }) => {
  const divArray = Array.from({ length: numberOfDivs }, (_, index) => <BsWindowFullscreen key={index} color="red" size={40} />);

  return (
    <Flex gap={4} flexDirection={direction}>
      {divArray}
    </Flex>
  );
};

const GetCodeModal = ({ website, isOpen, onClose }) => {
  const cancelRef = React.useRef();
  const [widgetLayout, setWidgetLayout] = useState({
    label: website?.banner?.widgetLayout,
    value: website?.banner?.widgetLayout,
  });
  const [isSubmit, setIsSubmit] = useState(true)
  const saveNativeBanner = useSaveNativeBannerMutation();

  function getWidgetLayout(str) {
    const [col, row] = str.split(':').map(Number);
    return { col, row };
  }

  const { control, handleSubmit, watch } = useForm({
    resolver: yupResolver(GetCodeNativeFormValidate),
    defaultValues: {
      color: website.banner.fontColor,
      fontSize: {
        label: website.banner.fontSize,
        value: website.banner.fontSize,
      },
      widget: {
        label: website.banner.widgetLayout,
        value: website.banner.widgetLayout,
      }
    },
  });

  const onSubmit = (value) => {
    saveNativeBanner.mutate(
      {
          adUnitId: website.banner._id,
          fontSize: value.fontSize.value,
          widgetLayout: value.widget.value,
          fontColor: value.color
      },
      {
          onSuccess: () => {
              toast.showMessageSuccess("Đã lưu.");
              setIsSubmit(true)
          },
      }
  );
  };

  const renderScript = banner => {
    if (banner.adUnit === AVAILABLE_AD_UNITS.NATIVE_BANNER)
      return `<script async="async" data-cfasync="false" src="${banner.script}"></script><div id="container-0076a1fb53fa77001d6c028ae069dc3a"></div>`;
    if (banner.adUnit.includes('BANNER'))
      return `<script type="text/javascript">
atOptions = {
  'key' : 'fc3e77962a32068331cf3a8c059cb5a9',
  'format' : 'iframe',
  'height' : ${banner.height},
  'width' : ${banner.width},
  'params' : {}
};
document.write('<scr' + 'ipt type="text/javascript" src="${banner.script}"></scr' + 'ipt>');
</script>`;
    if (banner.adUnit === AVAILABLE_AD_UNITS.POP_UNDER || banner.adUnit === AVAILABLE_AD_UNITS.SOCIAL_BAR)
      return `<script type='text/javascript' src=''`; // còn case này
    if (banner.adUnit === AVAILABLE_AD_UNITS.DIRECT_LINK) return 'direct link'; // còn case này
  };

  const { onCopy } = useClipboard(renderScript(website.banner));

  const handleClickCopy = () => {
    onCopy();
    toast.showMessageSuccess('Đã sao chép.');
  };

  useEffect(() => {
    watch(() => setIsSubmit(false));
 }, [watch]);

  return (
    <AlertDialog motionPreset="slideInBottom" leastDestructiveRef={cancelRef} onClose={onClose} isOpen={isOpen} isCentered>
      <AlertDialogOverlay />
      <AlertDialogContent padding={10} maxWidth={'100%'} marginX={'10%'}>
        <AlertDialogHeader>
          <Flex alignItems={'center'} gap={2} fontSize={'20px'}>
            <Text>{website.banner.name}</Text>
            <Text>for</Text>
            <TbWorld />
            <Text>{website.website.url}</Text>
          </Flex>
        </AlertDialogHeader>
        <AlertDialogCloseButton margin={10} fontSize={16} />
        <AlertDialogBody overflowX="auto" paddingBottom={8} fontSize={'16px'}>
          <Text>
            {(website.banner.adUnit === AVAILABLE_AD_UNITS.NATIVE_BANNER ? 'Native Banner có thể được đặt ' : 'Đặt nó ') +
              'ở bất cứ đâu trong nội dung trang.'}
          </Text>
          <br />
          {website.banner.adUnit === AVAILABLE_AD_UNITS.NATIVE_BANNER && (
            <form>
              <Flex color="white" marginTop={6} gap={10}>
                <Box flex="1" color={'#121F4B'}>
                  <SelectController
                    control={control}
                    name="widget"
                    label="Widget Layout"
                    options={WidgetLayoutOptions}
                    onChange={value => setWidgetLayout(value)}
                  />
                  <SelectController
                    styleContainer={{
                      marginTop: 6,
                    }}
                    control={control}
                    name="fontSize"
                    label="Font size"
                    options={FontSizeOptions}
                    onChange={value => console.log(value)}
                  />
                  <InputController
                    control={control}
                    name="color"
                    label="Font color"
                    styleBoxInput={{ flex: 1 }}
                    styleLabel={{ marginTop: '10px' }}
                  />
                  <Button marginTop={6} float={'right'} onClick={handleSubmit(onSubmit)} isDisabled={isSubmit}>
                    Save
                  </Button>
                </Box>
                <Box flex="1">
                  {getWidgetLayout(widgetLayout.value).col > getWidgetLayout(widgetLayout.value).row ? (
                    <CreateScreenGenerator numberOfDivs={getWidgetLayout(widgetLayout.value).col} direction={DIRECTION.HORIZONTAL} />
                  ) : widgetLayout.value === '2:2' ? (
                    <Flex gap={3} flexDirection={'column'}>
                      <Flex gap={4}>
                        <BsWindowFullscreen color="red" size={40} />
                        <BsWindowFullscreen color="red" size={40} />
                      </Flex>
                      <Flex gap={4}>
                        <BsWindowFullscreen color="red" size={40} />
                        <BsWindowFullscreen color="red" size={40} />
                      </Flex>
                    </Flex>
                  ) : (
                    <CreateScreenGenerator numberOfDivs={getWidgetLayout(widgetLayout.value).row} direction={DIRECTION.VERTICAL} />
                  )}
                </Box>
              </Flex>
              <br />
            </form>
          )}
          <Box maxHeight={'210px'} bg={'#f2f2f2'} color={'#222222'} padding={5}>
            <Text>{renderScript(website.banner)}</Text>
          </Box>
          <Button
            onClick={handleClickCopy}
            marginTop={6}
            float={'right'}
            bg={'blue.500'}
            color={'white'}
            border={'1px solid transparent'}
            _hover={{
              color: 'blue.500',
              bg: 'white',
              border: '1px solid #3182CE',
            }}
          >
            <CopyIcon mr={2} />
            COPY CODE
          </Button>
        </AlertDialogBody>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default GetCodeModal;
