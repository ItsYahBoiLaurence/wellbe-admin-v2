import { ActionIcon, AppShell, Avatar, Box, Burger, Button, Divider, Drawer, Flex, Group, NativeSelect, Stack, Switch, Text, Title, useDrawersStack } from '@mantine/core';
import { Outlet } from 'react-router-dom';
import Logo from '../../assets/logo.svg';
import NavItems from './NavItems';
import { useDisclosure } from '@mantine/hooks';
import { IconSettings, IconLogout } from '@tabler/icons-react';

const Layout = () => {
  const [opened, { toggle }] = useDisclosure();
  const stack = useDrawersStack(['profile', 'settings'])

  return (
    <AppShell
      header={{ height: { base: 60, md: 70, lg: 80 } }}
      navbar={{
        width: { base: 200, md: 250, lg: 300 },
        breakpoint: 'sm',
        collapsed: { mobile: !opened },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Drawer.Stack>
          <Drawer {...stack.register('profile')} position='right'>
            <Stack gap={'xl'} p={'sm'}>
              <Box>
                <Avatar
                  name='John Laurence Burgos'
                  size={120}
                  radius={120}
                  mx="auto"
                />
                <Text ta="center" fz="lg" fw={500} mt="md">
                  Admin Profile
                </Text>
                <Text ta="center" c="dimmed" fz="sm">
                  Company Name
                </Text>
              </Box>
              <Stack gap={'sm'}>
                <Group justify='space-between'>
                  <Text size='lg' fw={700}>First Name</Text>
                  <Text size='lg' fw={300}>John Laurence</Text>
                </Group>
                <Divider my="md" />
                <Group justify='space-between'>
                  <Text size='lg' fw={700}>Last Name</Text>
                  <Text size='lg' fw={300}>Burgos</Text>
                </Group>
                <Divider my="md" />
                <Group justify='space-between'>
                  <Text size='lg' fw={700}>Role</Text>
                  <Text size='lg' fw={300}>Admin</Text>
                </Group>
                <Divider my="md" />
                <Group justify='space-between'>
                  <Text size='lg' fw={700}>Email</Text>
                  <Text size='lg' fw={300}>laurence@mayan.com.ph</Text>
                </Group>
                <Divider my="md" />
                <Group justify='space-between' onClick={() => stack.open('settings')}>
                  <Text size='lg' fw={700}>Settings</Text>
                  <IconSettings />
                </Group>
                <Divider my="md" />
                <Group justify='space-between'>
                  <Text size='lg' fw={700} c={'red'}>Logout</Text>
                  <IconLogout color='red' />
                </Group>
              </Stack>
            </Stack>
          </Drawer>

          <Drawer {...stack.register('settings')} position='right'>
            <Stack gap='lg'>
              <Stack gap='md'>
                <Text fw={200}>Notifications and Alerts</Text>
                <Flex justify='space-between'>
                  <Box ms={'md'}>
                    <Title order={4} fw={500}>Survey reminders</Title>
                    <Text size='xs' fw={200}>Enable or disable automatic reminders for employees to be sent via email</Text>
                  </Box>
                  <Switch
                    defaultChecked
                    color="teal"
                  />
                </Flex>
              </Stack>
              <Stack gap='md'>
                <Text fw={200}>System Preferences</Text>
                <Stack ms={'md'}>
                  <Box>
                    <Title order={4} fw={500}>Survey reminders</Title>
                    <Text size='xs' fw={200}>Enable or disable automatic reminders for employees to be sent via email</Text>
                  </Box>
                  <NativeSelect data={['Daily', 'Weekly', 'Monthly']} />
                  <Box>
                    <Title order={4} fw={500}>Data Retention Policy</Title>
                    <Text size='xs' fw={200}>Configure how long data will be stored before being archived or deleted.</Text>
                  </Box>
                </Stack>
              </Stack>
            </Stack>
          </Drawer>
        </Drawer.Stack>

        <Group h="100%" px="md" justify='space-between'>
          <Box>
            <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
            <img src={Logo} width={189} height={53} alt="Wellbe Analytics Portal" />
          </Box>
          <Avatar name='John Laurence Burgos' onClick={() => stack.open('profile')} />
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md" style={{ backgroundColor: '#fff' }}>
        <NavItems />
      </AppShell.Navbar>

      <AppShell.Main style={{ backgroundColor: '#F7F8FA' }}>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
};
export default Layout;
