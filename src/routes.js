import React from 'react';
import { IoBook, IoListCircleOutline } from 'react-icons/io5';
import { HomeIcon, PersonIcon } from 'components/Icons/Icons';
import Dashboard from 'views/Dashboard/Dashboard.js';
import SignUp from 'views/Pages/SignUp.js';
import SignIn from 'views/Pages/SignIn';
import Profile from 'views/Dashboard/Profile';
import { Roles } from 'constants/common';
import Size from 'views/Dashboard/Size';
import Colors from 'views/Dashboard/Colors';
import Product from 'views/Dashboard/Product';
import ProductForm from 'views/Dashboard/Product/components/ProductForm';
import Category from 'views/Dashboard/Category/Category';

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
    path: '/category/:id/size',
    name: 'Size',
    icon: <PersonIcon color="inherit" />,
    redirect: true,
    layout: '/admin',
    component: Size,
    role: [Roles.ADMIN],
  },
  {
    path: '/category/:id/colors',
    name: 'Colors',
    icon: <PersonIcon color="inherit" />,
    redirect: true,
    layout: '/admin',
    component: Colors,
  },
  {
    path: '/category',
    name: 'Thể loại',
    icon: <IoBook color="inherit" />,
    layout: '/admin',
    component: Category,
    role: [Roles.ADMIN],
  },
  {
    path: '/product/create',
    name: 'Tạo sản phẩm',
    icon: <IoListCircleOutline size={20} />,
    redirect: true,
    layout: '/admin',
    component: ProductForm,
    role: [Roles.ADMIN],
  },
  {
    path: '/product/:id',
    name: 'Chi tiết sản phẩm',
    icon: <IoListCircleOutline size={20} />,
    redirect: true,
    layout: '/admin',
    component: ProductForm,
    role: [Roles.ADMIN],
  },
  {
    path: '/product',
    name: 'Sản phẩm',
    icon: <IoListCircleOutline size={20} />,
    layout: '/admin',
    component: Product,
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
