import { AppShell } from '@mantine/core';
import { Outlet } from 'react-router-dom';
import Logo from '../../assets/logo.svg';
import NavHeader from './NavHeader';
import NavItems from './NavItems';

const Layout = () => {
  return (
    <AppShell
      navbar={{
        width: 345,
        breakpoint: 'sm',
      }}
    >
      <AppShell.Navbar pl={46} pt={41} style={{ backgroundColor: '#fff' }}>
        <img src={Logo} width={189} height={53} alt="Wellbe Analytics Portal" />
        <NavItems mt={56} pr={47} />
      </AppShell.Navbar>
      <AppShell.Main style={{ backgroundColor: '#f7f8fa' }}>
        <NavHeader />
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
};

export default Layout;
