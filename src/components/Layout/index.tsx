import { AppShell, Burger, Group } from '@mantine/core';
import { Outlet } from 'react-router-dom';
import Logo from '../../assets/logo.svg';
import NavHeader from './NavHeader';
import NavItems from './NavItems';
import { useDisclosure } from '@mantine/hooks';

const Layout = () => {
  const [opened, { toggle }] = useDisclosure();
  return (
    <AppShell
      header={{ height: { base: 60, md: 70, lg: 80 } }}
      navbar={{
        width: { base: 200, md: 300, lg: 400 },
        breakpoint: 'sm',
        collapsed: { mobile: !opened },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <img src={Logo} width={189} height={53} alt="Wellbe Analytics Portal" />
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md" style={{ backgroundColor: '#fff' }}>
        <NavItems />
      </AppShell.Navbar>

      <AppShell.Main style={{ backgroundColor: 'pink' }}>
        <Outlet />
      </AppShell.Main>
    </AppShell>






    // <AppShell
    //   navbar={{
    //     width: 345,
    //     breakpoint: 'sm',
    //   }}
    // >
    //   <AppShell.Navbar pl={46} pt={41} style={{ backgroundColor: '#fff' }}>
    //     
    //     <NavItems mt={56} pr={47} />
    //   </AppShell.Navbar>
    //   <AppShell.Main w={'100%'} style={{ backgroundColor: 'pink' }}>
    //     <NavHeader />
    //     
    //   </AppShell.Main>
    // </AppShell>
  );
};

export default Layout;
