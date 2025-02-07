import { Flex, FlexProps, NavLink, Tabs, TabsList, Text } from '@mantine/core';
import {
  DashboardIcon,
  ClientsIcons,
  QuestionsIcon,
  UsersIcon,
  SettingsIcon
} from '../icons';
import { useLocation, useNavigate } from 'react-router-dom';


const ITEMS = [
  {
    label: 'Dashboard',
    icon: DashboardIcon,
    href: '/',
  },
  {
    label: 'Employees',
    icon: ClientsIcons,
    href: '/employees',
  },
  {
    label: 'Users',
    icon: UsersIcon,
    href: '/users',
  },
];

const NavItems = (props: FlexProps) => {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <Flex direction="column" align={'center'} justify={'center'} gap={6} {...props}>
      <Tabs
        value={location.pathname}
        onChange={(value) => navigate(value!)}
        orientation='vertical'
        variant='pills'
        color='gray'
        radius={'xl'}
      >
        <Tabs.List >
          {ITEMS.map((i) => (
            <Tabs.Tab
              key={i.href}
              value={i.href}
              px={'xxl'}
              py={'md'}
              mb={'md'}
              leftSection={<i.icon />}
            >
              <Text size='xl'>
                {i.label}
              </Text>
            </Tabs.Tab>
          ))}
        </Tabs.List>
      </Tabs>

    </Flex>
  );
};

export default NavItems;
