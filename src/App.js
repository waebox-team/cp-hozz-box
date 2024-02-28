import React from 'react';
import { HashRouter, Route, Switch, Redirect } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ChakraProvider } from '@chakra-ui/react';

import AuthLayout from 'layouts/Auth';
import AdminLayout from 'layouts/Admin.js';
import RTLLayout from 'layouts/RTL.js';

// Custom Chakra theme
import theme from 'theme/theme.js';
import { UserProvider } from 'context/UserContext';

import '@trendmicro/react-paginations/dist/react-paginations.css';
import './styles/globals.css';

const client = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnReconnect: 'always',
      retry: 0,
      staleTime: 0,
    },
  },
});

const App = () => {
  return (
    <ChakraProvider theme={theme} resetCss={false} position="relative">
      <QueryClientProvider client={client}>
        <UserProvider>
          <HashRouter>
            <Switch>
              <Route path={`/auth`} component={AuthLayout} />
              <Route path={`/admin`} component={AdminLayout} />
              <Route path={`/rtl`} component={RTLLayout} />
              <Redirect from={`/`} to="/admin/dashboard" />
            </Switch>
          </HashRouter>
        </UserProvider>
      </QueryClientProvider>
    </ChakraProvider>
  );
};

export default App;
