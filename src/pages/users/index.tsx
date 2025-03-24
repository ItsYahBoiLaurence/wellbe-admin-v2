import { Avatar, Box, Button, Flex, Group, Paper, ScrollArea, Stack, Table, Text, Title } from "@mantine/core"
import { IconPencil } from '@tabler/icons-react';
import { useState } from "react";
import classes from '../../css/TableScrollArea.module.css'
import cx from 'clsx';
import { useQuery } from "react-query";
import { getAllUsers } from "../../api/apiService";

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
    const [scrolled, setScrolled] = useState(false)

    const { data: allUsers, isSuccess } = useQuery({
        queryKey: ['AllUsers'],
        queryFn: getAllUsers
    })

    return (
        <Paper p='xxl'>
            <Stack>
                <Title order={1} fw={700}>Admin User Management</Title>
                <Flex w='100%' justify='space-between'>
                    <Box>
                        <Title order={3} fw={500}>Profile and Members</Title>
                    </Box>
                    <Button variant="filled" color="#515977" radius='xl' px="xl">+Add</Button>
                </Flex>
                <ScrollArea h={500} onScrollPositionChange={({ y }) => setScrolled(y !== 0)}>
                    {isSuccess ?
                        <Table miw='700'>
                            <Table.Thead className={cx(classes.header, { [classes.scrolled]: scrolled })}>
                                <Table.Tr >
                                    <Table.Th>NAME</Table.Th>
                                    <Table.Th>EMAIL</Table.Th>
                                    <Table.Th></Table.Th>
                                </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>
                                {allUsers?.adminList.map((user) => (
                                    <Table.Tr key={user._id} onClick={() => console.log(`Open the sidebar Popup for the ${user._id}`)}>
                                        <Table.Td>
                                            <Group>
                                                <Avatar name={`${user.name}`} color={randomizer() as string} allowedInitialsColors={['blue', 'red']}></Avatar>
                                                {`${user.name}`}
                                            </Group>
                                        </Table.Td>
                                        <Table.Td>{user.email}</Table.Td>
                                    </Table.Tr>
                                ))}
                            </Table.Tbody>
                        </Table>

                        : (
                            <Text>Loading...</Text>
                        )}
                </ScrollArea>
            </Stack >
        </Paper >
    )
}
export default Users