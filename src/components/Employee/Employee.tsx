import { Avatar, Box, Button, Drawer, Flex, NativeSelect, Paper, Stack, Text, TextInput } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import { useForm } from "react-hook-form"
import { useMutation } from 'react-query';
import { updateEmployee } from "../../api/apiService";
import queryClient from "../../queryClient";
import { IconChevronDown } from "@tabler/icons-react";
import { useEffect, useState } from "react";

const UserCard = ({ department, dataEmployee, dropdownData }) => {


    const [opened, { open, close }] = useDisclosure(false)

    const { register, handleSubmit, setValue, formState: { isSubmitting } } = useForm({
        defaultValues: {
            department: department,
            firstName: dataEmployee.firstName,
            lastName: dataEmployee.lastName,
            email: dataEmployee.email,
        }
    })

    const { mutateAsync: updateUserInfo } = useMutation({
        mutationFn: updateEmployee,
        onSuccess: () => {
            queryClient.invalidateQueries(['dataOfDepartment'])
        }
    })

    const [notif, setNotif] = useState(false)



    const onsubmit = async (data) => {
        try {
            await updateUserInfo(data)
            setNotif(true)
        } catch (error) {
            throw error
        }
    }

    useEffect(() => {
        setTimeout(() => {
            setNotif(false)
        }, 5000)
    }, [notif])

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
                                <form onSubmit={handleSubmit(onsubmit)} style={{ height: '100%' }}  >
                                    <Text my={'lg'} size="lg" fw={700}>Employee Details</Text>
                                    <Stack justify="space-between" h={'95%'}>
                                        <Flex direction={'column'} gap={'md'}>
                                            <NativeSelect
                                                label={<Text fw={700} >Department</Text>}
                                                data={dropdownData}
                                                rightSection={<IconChevronDown size={16} />}
                                                defaultValue={department}
                                                onChange={(e) => setValue('department', e.target.value)}
                                            />

                                            <TextInput
                                                label={<Text fw={700}>First Name</Text>}
                                                {...register('firstName')}
                                                placeholder={dataEmployee.firstName}
                                            />

                                            <TextInput
                                                label={<Text fw={700}>Lastname</Text>}
                                                {...register('lastName')}
                                                placeholder={dataEmployee.lastName}
                                            />

                                            <TextInput
                                                label={<Text fw={700}>Email</Text>}
                                                {...register('email')}
                                                placeholder={dataEmployee.email}
                                            />
                                            {notif && <Text c={'green'}>Update Success!!</Text>}
                                        </Flex>
                                        <Stack gap={'sm'}>
                                            <Button variant="filled" type="submit" disabled={isSubmitting} color="#515977">{isSubmitting ? "Saving..." : "Save"}</Button>
                                            <Button color="#515977" variant="outline">Delete</Button>
                                        </Stack>
                                    </Stack>
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