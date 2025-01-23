import { useRoutes } from 'react-router-dom';
import Layout from './components/Layout';
import PageNotFound from './pages/404';
import Dashboard from './pages/dashboard';

function Routes() {
  return useRoutes([
    {
      path: '/',
      element: <Layout />,
      children: [
        {
          path: '/',
          element: <Dashboard />,
        },
      ],
    },

    {
      path: '*',
      element: <PageNotFound />,
    },
  ]);
}

export default Routes;
