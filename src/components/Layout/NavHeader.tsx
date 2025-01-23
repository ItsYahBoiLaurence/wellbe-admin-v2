import { ActionIcon, Avatar, Box, Flex, Text, TextInput } from '@mantine/core';
import { HelpIcon, NotificationIcon, SearchIcon, SettingsIcon } from '../icons';

const UserInfo = () => {
  return (
    <Flex align="center">
      <Flex direction="column" mr={24}>
        <Text style={{ textAlign: 'right' }}>Admin</Text>
        <Text fw={700}>Samantha Cruz</Text>
      </Flex>
      <Avatar src="avatar.png" size={60} />
    </Flex>
  );
};

const NavHeader = () => {
  return (
    <Flex align="center" px={51} py={30} style={{ backgroundColor: '#fff' }} justify={'flex-end'}>
      <Flex gap={48} align="center" mr={49}>
        <ActionIcon size="lg" variant="white" radius="50%">
          <HelpIcon size={32} color="#A5A5A5" />
        </ActionIcon>
        <ActionIcon size="lg" variant="white" radius="50%">
          <SettingsIcon size={32} color="#A5A5A5" />
        </ActionIcon>
        <ActionIcon size="lg" variant="white" radius="50%">
          <NotificationIcon size={32} color="#A5A5A5" />
        </ActionIcon>
      </Flex>
      <UserInfo />
    </Flex>
  );
};

export default NavHeader;
