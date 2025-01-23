import { Flex, FlexProps, NavLink } from '@mantine/core';
import {
  DashboardIcon,
  ClientsIcons,
  QuestionsIcon,
  UsersIcon,
} from '../icons';

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
  // {
  //   label: 'Users',
  //   icon: UsersIcon,
  //   href: '/users',
  // },
];

const NavItems = (props: FlexProps) => {
  return (
    <Flex direction="column" gap={6} {...props}>
      {ITEMS.map((item) => (
        <NavLink
          key={`nav-item-${item.label}`}
          href={item.href}
          label={item.label}
          leftSection={<item.icon size={32} color="#A5A5A5" />}
          style={{
            padding: '18.33px 25.33px',
            borderRadius: '60px',
            '& .mantineNavLinkSection': { marginRight: 24 },
          }}
        />
      ))}
    </Flex>
  );
};

export default NavItems;
