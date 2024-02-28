import React from 'react';
import { BsSoundwave } from 'react-icons/bs';
import { HomeIcon, DocumentIcon, PersonIcon, GlobeIcon, SupportIcon } from 'components/Icons/Icons';
import Dashboard from 'views/Dashboard/Dashboard.js';
import SignUp from 'views/Pages/SignUp.js';
import SignIn from 'views/Pages/SignIn';
import Profile from 'views/Dashboard/Profile';
import Website from 'views/Dashboard/Website/Website';
import DirectLink from 'views/Dashboard/DirectLink/DirectLink';
import Referrals from 'views/Dashboard/Referrals/Referrals';
import Support from 'views/Dashboard/Support/Support';
import Statistics from 'views/Dashboard/Statistics/Statistics';

var dashRoutes = [
  // {
  //   path: '/dashboard',
  //   name: 'Dashboard',
  //   icon: <HomeIcon color="inherit" />,
  //   layout: '/admin',
  //   component: Dashboard,
  // },
  {
    path: '/statistics',
    name: 'Statistics',
    icon: <BsSoundwave color="inherit" />,
    secondaryNavbar: true,
    layout: '/admin',
    component: Statistics,
  },
  {
    path: '/website',
    name: 'Website',
    icon: <DocumentIcon color="inherit" />,
    secondaryNavbar: true,
    layout: '/admin',
    component: Website,
  },
  {
    path: '/direct-link',
    name: 'Direct Link',
    icon: <GlobeIcon color="inherit" />,
    secondaryNavbar: true,
    layout: '/admin',
    component: DirectLink,
  },
  {
    path: '/referrals',
    name: 'Referrals',
    icon: <PersonIcon color="inherit" />,
    secondaryNavbar: true,
    layout: '/admin',
    component: Referrals,
  },
  {
    path: '/support',
    name: 'Support',
    icon: <SupportIcon color="inherit" />,
    secondaryNavbar: true,
    layout: '/admin',
    component: Support,
  },
  {
    name: 'ACCOUNT PAGES',
    category: 'account',
    rtlName: 'صفحات',
    state: 'pageCollapse',
    views: [
      {
        path: '/profile',
        name: 'Profile',
        icon: <PersonIcon color="inherit" />,
        secondaryNavbar: true,
        layout: '/admin',
        component: Profile,
      },
      {
        path: '/sign-in',
        layout: '/auth',
        redirect: true,
        component: SignIn,
      },
      {
        path: '/sign-up',
        layout: '/auth',
        redirect: true,
        component: SignUp,
      },
    ],
  },
];

export default dashRoutes;
