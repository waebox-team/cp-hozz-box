import React from 'react';
import { useHistory } from 'react-router-dom';
import { Flex, Text, useColorModeValue } from '@chakra-ui/react';
import Card from 'components/Card/Card';
import CardHeader from 'components/Card/CardHeader';
import { CookieStorage } from 'utils/cookie-storage';
import { StorageKeys } from 'constants/storage-keys';
import { ROOT_APP } from 'constants/common';
// import ChooseBanner from './components/ChooseBanner';
// import { useQueryGetAppSetting } from 'services/referrals';

export const initialFilter = {
  pageSize: 10,
  pageIndex: 0,
};

function Referrals() {
  const textColor = useColorModeValue('gray.700', 'white');
  const user = CookieStorage.getCookieData(StorageKeys.UserInfo);
  const history = useHistory();

  //   const {
  //     data,
  //     isLoading: isLoadingComics,
  //     refetch,
  //   } = useQueryGetAppSetting();

  return (
    <Flex direction="column" pt={{ base: '120px', md: '75px', lg: '100px' }}>
      <Card p="16px" mb="24px" bg="#fff">
        <CardHeader p="12px 5px" mb="12px">
          <Flex direction="column" alignItems={'center'}>
            <Text fontSize="x-large" color={textColor} fontWeight="bold">
              Referral Link
            </Text>
            <Text
              marginTop={'10px'}
              cursor={'pointer'}
              onClick={() => {
                history.push(`/auth/sign-up?ref=${user.referral}`);
              }}
            >
              {ROOT_APP + '/refferal/' + user.referral}
            </Text>
          </Flex>
        </CardHeader>
      </Card>
      {/* <ChooseBanner informationBanner={data?.data} /> */}
    </Flex>
  );
}

export default Referrals;
