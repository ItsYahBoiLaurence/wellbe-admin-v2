import { Avatar, Box, Button, Drawer, Flex, NativeSelect, Paper, Stack, Text, TextInput } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import { useForm } from "react-hook-form"
import { useMutation, useQuery } from 'react-query';
import { getAllDepartments, updateEmployee } from "../../api/apiService";
import queryClient from "../../queryClient";
import { IconChevronDown } from "@tabler/icons-react";
import { useEffect, useState } from "react";

const UserCard = ({ department, dataEmployee, dropdownData }) => {

    const staticDepartmentOptions = [
        { label: 'No Department Available', value: '' },
    ];

    const transformDepartmentData = (data: any[]): { label: string; value: string }[] =>
        Array.isArray(data)
            ? data.map((department) => ({ label: department, value: department }))
            : [];

    // Fetch all departments (to populate the dropdown)
    const { data: allDepartments, refetch: refetchDepartment } = useQuery({
        queryKey: ['AllDepartmentInCompany'],
        queryFn: getAllDepartments,
    });
    // Use the transformed data if available, otherwise fallback to static options.
    const departmentOptionsFromApi = allDepartments
        ? transformDepartmentData(allDepartments)
        : staticDepartmentOptions;

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
            queryClient.invalidateQueries({ queryKey: ['dataOfDepartment'] })
        }
    })

    const [notif, setNotif] = useState(false)


    const onsubmit = async (data) => {
        console.log(data)
        try {
            await updateUserInfo(data)
            setNotif(true)
            refetchDepartment()
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
                                <Text size="xl" fw={700}>Edit Employee Details </Text>
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
                        <Drawer.Body h={'100%'}>
                            <Box h={'95%'} pt={'lg'}>
                                <form onSubmit={handleSubmit(onsubmit)} style={{ height: '100%' }} >
                                    <Stack justify="space-between" h={'95%'}>
                                        <Flex direction={'column'} gap={'md'}>
                                            <NativeSelect
                                                label={<Text fw={700} >Department</Text>}
                                                rightSection={<IconChevronDown size={16} />}
                                                onChange={(e) => setValue('department', e.target.value)}
                                            >
                                                <option value=''>Select Department</option>
                                                {departmentOptionsFromApi.map(({ label, value }) => (
                                                    <option key={value} value={value}>{label}</option>
                                                ))}
                                            </NativeSelect>

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
                                            <Button variant="outline" onClick={close} disabled={isSubmitting} color="#515977">Back</Button>
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