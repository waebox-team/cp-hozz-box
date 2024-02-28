import React from 'react';
import { HomeIcon, PersonIcon } from 'components/Icons/Icons';
import Dashboard from 'views/Dashboard/Dashboard.js';
import SignUp from 'views/Pages/SignUp.js';
import SignIn from 'views/Pages/SignIn';
import Profile from 'views/Dashboard/Profile';
import { Roles } from 'constants/common';

var dashRoutes = [
  {
    path: '/dashboard',
    name: 'Dashboard',
    icon: <HomeIcon color="inherit" />,
    layout: '/admin',
    component: Dashboard,
    role: [Roles.ADMIN],
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
        role: [Roles.ADMIN, Roles.USER, Roles.GUEST],
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
