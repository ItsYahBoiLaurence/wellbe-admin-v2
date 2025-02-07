import { useRoutes } from 'react-router-dom';
import Layout from './components/Layout';
import PageNotFound from './pages/404';
import Dashboard from './pages/dashboard';
import Employees from './pages/employees';
import Users from './pages/users'


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
        {
          path: '/employees',
          element: <Employees />
        },
        {
          path: '/users',
          element: <Users />
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
