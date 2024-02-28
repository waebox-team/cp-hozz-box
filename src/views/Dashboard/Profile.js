import React from 'react';
import {
  Flex,
} from '@chakra-ui/react';

import { useUserState } from 'context/UserContext';
import VerticalTab from 'components/VerticalTab/VerticalTab';
import { ImProfile } from "react-icons/im";
import { IoKey } from "react-icons/io5";
import { TabFeatureProfile } from 'constants/common';

let sideMenu = {
  data: [
    {
      infor: {
        tab: TabFeatureProfile.IdentityInfo,
        name: "Identity Info",
        iconMenu: <ImProfile />,
      }
    },
    {
      infor: {
        tab: TabFeatureProfile.ChangePassword,
        name: "Change Password",
        iconMenu: <IoKey />,
      }
    },
  ]
};

function Profile() {
  const { isAuthenticated } = useUserState();

  return (
    <Flex direction="column" pt={{ base: '120px', md: '75px', lg: '100px' }}>
      {!!isAuthenticated ? (
        <>
          <VerticalTab data={sideMenu.data} />
        </>
      ) : (
        ''
      )}
    </Flex>
  );
}

export default Profile;
