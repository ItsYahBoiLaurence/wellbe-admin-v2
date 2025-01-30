import { Avatar, Box, Drawer, Flex, Paper, Text } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import { useForm } from "react-hook-form"

const UserCard = ({ department, dataEmployee }) => {

    const [opened, { open, close }] = useDisclosure(false)

    console.log(dataEmployee)
    return (
        <Box>
            <Drawer.Stack>
                <Drawer.Root
                    key={1}
                    position={'right'}
                    size={'md'}
                    opened={opened} onClose={close}
                >
                    <Drawer.Overlay />
                    <Drawer.Content>
                        <Drawer.Header style={{ backgroundColor: '#515977' }}>
                            <Drawer.Title style={{ color: 'white', }}>
                                <Text size="xl">Employee Details</Text>
                            </Drawer.Title>
                            <Drawer.CloseButton
                                style={{
                                    color: 'white',
                                    transition: 'none',
                                    background: 'none',
                                    border: 'none',
                                    boxShadow: 'none',
                                    cursor: 'pointer',
                                }}
                            />
                        </Drawer.Header>
                        <Drawer.Body h={'90%'}>
                            <Box h={'95%'}>
                                <form>

                                </form>
                            </Box>
                        </Drawer.Body>
                    </Drawer.Content>
                </Drawer.Root>
            </Drawer.Stack>

            <Paper radius={'md'} p={'xl'} onClick={() => open()}>
                <Flex align={'center'} gap={'lg'}>
                    <Avatar size={'lg'}>{dataEmployee.firstName[0]}</Avatar>
                    <Box>
                        <Text size="xs">{department}</Text>
                        <Text size="md" fw={700}>{`${dataEmployee.firstName} ${dataEmployee.lastName}`}</Text>
                    </Box>
                </Flex>
            </Paper>
        </Box>
    )
}

export default UserCard