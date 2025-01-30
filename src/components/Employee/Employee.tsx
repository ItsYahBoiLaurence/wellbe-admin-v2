import { Avatar, Box, Button, Drawer, Flex, Paper, Text, TextInput } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import { useForm } from "react-hook-form"
import { useMutation } from 'react-query';
import { updateEmployee } from "../../api/apiService";
import queryClient from "../../queryClient";

const UserCard = ({ department, dataEmployee }) => {


    const [opened, { open, close }] = useDisclosure(false)

    const { register, handleSubmit } = useForm({
        defaultValues: {
            department: dataEmployee.department,
            firstName: dataEmployee.firstName,
            lastName: dataEmployee.lastName,
            email: dataEmployee.email,
        }
    })

    const { mutateAsync: updateUserInfo } = useMutation({
        mutationFn: updateEmployee,
        onSuccess: () => {
            queryClient.invalidateQueries('departmentData')
        }
    })


    const onsubmit = async (data) => {
        try {
            await updateUserInfo(data)
        } catch (error) {
            throw error
        }
    }

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
                                <Text size="xl">Manage Employee</Text>
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
                                <form onSubmit={handleSubmit(onsubmit)}>
                                    <Text my={'lg'} fw={700}>Employee Details</Text>
                                    <Flex direction={'column'} gap={'md'}>
                                        <Box>
                                            <Text fw={700} >Department</Text>
                                            <TextInput
                                                {...register('department')}
                                                placeholder={dataEmployee.department}
                                            />
                                        </Box>

                                        <Box>
                                            <Text fw={700}>First Name</Text>
                                            <TextInput
                                                {...register('firstName')}
                                                placeholder={dataEmployee.firstName}
                                            />
                                        </Box>
                                        <Box>
                                            <Text fw={700}>Last Name</Text>
                                            <TextInput
                                                {...register('lastName')}
                                                placeholder={dataEmployee.lastName}
                                            />
                                        </Box>
                                        <Box>
                                            <Text fw={700}>Company Email</Text>
                                            <TextInput
                                                {...register('email')}
                                                placeholder={dataEmployee.email}
                                            />
                                        </Box>
                                    </Flex>
                                    <Button type="submit">Save</Button>
                                    <Button>Delete</Button>
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