import { ActionIcon, AppShell, Avatar, Box, Burger, Button, Divider, Drawer, Flex, Group, NativeSelect, Stack, Switch, Text, TextInput, Title, useDrawersStack } from '@mantine/core';
import { Outlet } from 'react-router-dom';
import Logo from '../../assets/dashboard_logo.svg';
import NavItems from './NavItems';
import { useDisclosure } from '@mantine/hooks';
import { IconSettings, IconLogout, IconUserCircle } from '@tabler/icons-react';
import { useContext } from 'react';
import { AuthenticationContext } from '../../context/Authencation';
import api from '../../api/api';
import BatchButton from '../SendBatchButton/index'
import { useQuery } from 'react-query';
import LoaderComponent from '../V2Components/LoaderComponent'
import { useForm } from 'react-hook-form';

const FREQUENCY = ['DAILY', 'WEEKLY', 'EVERY_HOUR', 'EVERY_MINUTE']

const SettingsDrawer = ({ stack }) => {



  const { register, setValue, handleSubmit, formState: { isLoading, isSubmitSuccessful } } = useForm({
    defaultValues: {
      frequency: ""
    }
  })

  const onSubmit = async (data) => {
    try {
      const res = await api.patch('settings', data)
      console.log(res.data)
      REFETCH_SETTINGS()
      return res.data
    } catch (e) {
      console.log(e)
    }
  }

  const { data: SETTINGS, isError: noSETTINGS, isLoading: fetchingSETTINGS, refetch: REFETCH_SETTINGS } = useQuery({
    queryKey: ['SETTINGS'],
    queryFn: async () => {
      const res = await api.get('settings')
      return res.data
    }
  })

  if (fetchingSETTINGS) return <>fetching...</>
  if (noSETTINGS) return <>no data...</>

  console.log(SETTINGS)
  setValue('frequency', SETTINGS.frequency)

  return (
    <Drawer h={"100%"} {...stack.register('settings')} position='right'>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack gap='lg' justify='space-between' h={'100%'} >
          <Text fw={200}>System Preferences</Text>
          <Group grow ms={'md'} align='start' >
            <Box>
              <Title order={4} fw={500}>Survey reminders</Title>
              <Text size='xs' fw={200}>Enable or disable automatic reminders for employees to be sent via email</Text>
            </Box>
            <NativeSelect {...register('frequency')}>
              {FREQUENCY.map((item) => (
                <option value={item} key={item}>{item}</option>
              ))}
            </NativeSelect>
          </Group>
          {isSubmitSuccessful && <Text c={'green'}>Update Success!</Text>}
          <Button type='submit' disabled={isLoading}>{isLoading ? "Saving" : "Save"}</Button>
        </Stack>
      </form>
    </Drawer>
  )
}

const DrawerComponent = ({ stack }) => {
  const { logout } = useContext(AuthenticationContext)

  const { data: PROFILE, isError: noPROFILE, isLoading: fetchingPROFILE } = useQuery({
    queryKey: ['PROFILE'],
    queryFn: async () => {
      const res = await api.get('user')
      return res.data
    }
  })

  if (fetchingPROFILE) return <>fetching...</>
  if (noPROFILE) return <>Error...</>

  console.log(PROFILE)
  const { first_name, last_name, email, department } = PROFILE
  return (
    <>
      <Drawer.Stack>
        <Drawer {...stack.register('profile')} position='right'>
          <Stack gap={'xl'} p={'sm'}>
            <Box>
              <Avatar
                size={120}
                radius={120}
                mx="auto"
              ><IconUserCircle size={'72px'} /></Avatar>
              <Text ta="center" fz="lg" fw={500} mt="md">
                Admin Profile
              </Text>
              <Text ta="center" c="dimmed" fz="sm">
                {department.company.name}
              </Text>
            </Box>
            <Stack gap={'sm'}>
              <Group justify='space-between'>
                <Text size='lg' fw={700}>First Name</Text>
                <Text size='lg' fw={300}>{first_name}</Text>
              </Group>
              <Divider my="md" />
              <Group justify='space-between'>
                <Text size='lg' fw={700}>Last Name</Text>
                <Text size='lg' fw={300}>{last_name}</Text>
              </Group>
              <Divider my="md" />
              <Group justify='space-between'>
                <Text size='lg' fw={700}>Email</Text>
                <Text size='lg' fw={300}>{email}</Text>
              </Group>
              <Divider my="md" />
              <Group justify='space-between' onClick={() => stack.open('settings')}>
                <Text size='lg' fw={700}>Settings</Text>
                <IconSettings />
              </Group>
              <Divider my="md" />
              <Group justify='space-between' onClick={logout}>
                <Text size='lg' fw={700} c={'red'}>Logout</Text>
                <IconLogout color='red' />
              </Group>
            </Stack>
          </Stack>
        </Drawer>
        <SettingsDrawer stack={stack} />
      </Drawer.Stack>
    </>
  )
}


const Layout = () => {
  const [opened, { toggle }] = useDisclosure();
  const stack = useDrawersStack(['profile', 'settings'])
  return (
    <>
      <DrawerComponent stack={stack} />
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
          <Group h="100%" px="lg" justify='space-between' align='center'>
            <Box >
              <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
              <img src={Logo} width={150} height={'100%'} alt="Wellbe Analytics Portal" />
            </Box>
            <Group>
              <BatchButton />
              <Avatar onClick={() => stack.open('profile')} ><IconUserCircle /></Avatar>
            </Group>
          </Group>

        </AppShell.Header>

        <AppShell.Navbar p="md" style={{ backgroundColor: '#fff' }}>
          <NavItems />
        </AppShell.Navbar>

        <AppShell.Main style={{ backgroundColor: '#F7F8FA' }}>
          <Outlet />
        </AppShell.Main>
      </AppShell>
    </>
  );
};
export default Layout;
