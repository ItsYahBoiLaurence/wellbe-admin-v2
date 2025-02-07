import { Avatar, Box, Button, Flex, Group, Paper, ScrollArea, Stack, Table, Text, Title } from "@mantine/core"
import { IconPencil } from '@tabler/icons-react';
import { useState } from "react";
import classes from '../../css/TableScrollArea.module.css'
import cx from 'clsx';

const admins = [
    { name: "Alexander Johnson", email: "alexander.johnson@example.com", role: "Admin" },
    { name: "David Smith", email: "david.smith@example.com", role: "Admin" },
    { name: "Sophia Martinez", email: "sophia.martinez@example.com", role: "Admin" },
    { name: "Emily Chu", email: "emily.chu@example.com", role: "Admin" },
    { name: "Mason Reynolds", email: "mason.reynolds@example.com", role: "Admin" },
    { name: "Ethan Carter", email: "ethan.carter@example.com", role: "Admin" },
    { name: "Isabella Brooks", email: "isabella.brooks@example.com", role: "Admin" },
    { name: "John Laurence Burgos", email: "laurence@mayan.com.ph", role: "Admin" },
    { name: "Catherine Alcala", email: "cathie@mayan.com.ph", role: "Admin" },
    { name: "Andrew Santos", email: "andrew@mayan.com.ph", role: "Admin" },
    { name: "Kim Nicole Montano", email: "kim@mayan.com.ph", role: "Admin" },
    { name: "Maureen Imperial", email: "maureen@mayan.com.ph", role: "Admin" },
]

const colors = ['grape', 'teal', 'orange', 'red']

const randomizer = () => {
    const color = colors[Math.floor(Math.random() * 4)]
    return color
}

const Users = () => {
    const currentUser = "John Smith"

    const adminUsers = admins.map((admin) => (
        <Table.Tr key={admin.name} onClick={() => console.log(`Open the sidebar Popup for the ${admin.name}`)}>
            <Table.Td>
                <Group>
                    <Avatar name={admin.name} color={randomizer() as string} allowedInitialsColors={['blue', 'red']}></Avatar>
                    {admin.name}
                </Group>
            </Table.Td>
            <Table.Td>{admin.email}</Table.Td>
            <Table.Td>{admin.role}</Table.Td>
            <Table.Td>
                <IconPencil onClick={() => console.log('aasdddss')} />
            </Table.Td>
        </Table.Tr>
    ))

    const [scrolled, setScrolled] = useState(false)

    return (
        <Paper p='xxl'>
            <Stack>
                <Title order={1} fw={700}>User Management</Title>
                <Flex w='100%' justify='space-between'>
                    <Box>
                        <Title order={3} fw={500}>Profile and Members</Title>
                        <Text size="sm">Simplify user roles for secure, seamless access control.</Text>
                    </Box>
                    <Button variant="filled" color="#515977" radius='xl' px="xl">+Add</Button>
                </Flex>
                <Paper bg='#FDFCFD' px='lg' py={'md'}>
                    <Group>
                        <Avatar color={randomizer()} size='lg' name={currentUser} />
                        <Text size="lg">{currentUser}</Text>
                    </Group>
                </Paper>
                <ScrollArea h={400} onScrollPositionChange={({ y }) => setScrolled(y !== 0)}>
                    <Table miw='700'>
                        <Table.Thead className={cx(classes.header, { [classes.scrolled]: scrolled })}>
                            <Table.Tr >
                                <Table.Th>NAME</Table.Th>
                                <Table.Th>EMAIL</Table.Th>
                                <Table.Th>ROLE</Table.Th>
                                <Table.Th></Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>{adminUsers}</Table.Tbody>
                    </Table>
                </ScrollArea>
            </Stack >
        </Paper >
    )
}
export default Users