import {
    Avatar,
    Box,
    Button,
    Center,
    Drawer,
    Flex,
    Group,
    LoadingOverlay,
    NativeSelect,
    Paper,
    SimpleGrid,
    Stack,
    Text,
    TextInput,
    Title,
    useDrawersStack,
    useMantineTheme,
} from '@mantine/core';
import { IconChevronDown, IconCloudUpload, IconDownload, IconX } from '@tabler/icons-react';
import { useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useDisclosure } from '@mantine/hooks';
import { useMutation, useQuery } from 'react-query';
import { addDepartment, getAllDepartments, getEmployees, sendEmail } from '../../api/apiService';
import { Dropzone } from '@mantine/dropzone';
import api from '../../api/api';
import AddDepartment from '../../components/V2Components/AddDepartment'
import InviteEmployee from '../../components/V2Components/InviteEmployee'
import PARTICIPATION_RATE from '../../components/V2Components/ParticipationRate'
import queryClient from '../../queryClient';


const EMPLOYEE_CARD = ({ department, department_names }) => {

    const stack = useDrawersStack(['batch-upload'])
    const [opened, { open, close }] = useDisclosure(false);



    const { register, handleSubmit, setValue, reset, formState: { isSubmitting } } = useForm({
        defaultValues: {
            first_name: "",
            last_name: "",
            email: "",
            department: ""
        }
    })
    const details = (first_name, last_name, email, department) => {
        setValue("first_name", first_name)
        setValue("last_name", last_name)
        setValue("email", email)
        setValue("department", department)
        open()
    }

    const onsubmit = async (data) => {
        try {
            const res = await api.patch('user', data)
            REFETCH_EMPLOYEES()
            reset()
            queryClient.clear()
            return res.data
        } catch (error) {
            console.log(error)
        }
    }

    const { data: EMPLOYEES, isError: noEMPLOYEES, isLoading: isFETCHINGEMPLOYEES, refetch: REFETCH_EMPLOYEES } = useQuery({
        queryKey: ['EMPLOYEES', department],
        queryFn: async ({ queryKey: [, department] }) => {
            // Build the request config: either { params: { department } } or empty object
            const config = department
                ? { params: { department } }
                : {};

            // Single GET, axios will omit undefined params automatically
            const { data } = await api.get('hr-admin/employees', config);
            return data;
        }
    })

    if (isFETCHINGEMPLOYEES) return (
        <LoadingOverlay
            h={'100px'}
            pos={'relative'}
            visible={true}
            zIndex={1000}
            overlayProps={{ radius: 'sm', blur: 20 }}
            loaderProps={{ color: '#515977', type: 'bars' }}
        />
    )

    if (noEMPLOYEES) return <>no employees</>

    if (EMPLOYEES.length === 0) return <Paper h={'100px'} ><Center h={'100%'}><Title order={2} >No employees!</Title></Center></Paper>

    console.log(EMPLOYEES)

    return (
        <>
            <Drawer.Stack>
                <Drawer.Root key={1} position="right" size="md" opened={opened} onClose={close}>
                    <Drawer.Overlay />
                    <Drawer.Content>
                        <Drawer.Header sx={{ backgroundColor: '#515977' }}>
                            <Drawer.Title sx={{ color: 'white' }}>
                                <Text size="xl">Employee Details</Text>
                            </Drawer.Title>
                            <Drawer.CloseButton
                                sx={{ color: 'white', background: 'none', border: 'none', boxShadow: 'none', cursor: 'pointer' }}
                            />
                        </Drawer.Header>
                        <Drawer.Body h="90%">
                            <form onSubmit={handleSubmit(onsubmit)} style={{ height: "100%" }}>
                                <Stack h={"100%"} justify='space-between'>
                                    <Stack gap={'sm'}>
                                        <NativeSelect
                                            {...register('department')}
                                            radius="md"
                                            label={<Text mb="xs" fw={700}>Department</Text>}
                                            style={{ width: '100%' }}
                                            size="md"
                                            rightSection={<IconChevronDown size={16} />}
                                        >

                                            <option value=''>Select Department</option>
                                            {department_names.map((item, index) => (
                                                <option key={index} value={item}>{item}</option>
                                            ))}
                                        </NativeSelect>
                                        <TextInput label={<Text fw={700}>First Name</Text>} {...register('first_name')} />
                                        <TextInput label={<Text fw={700}>Last Name</Text>} {...register('last_name')} />
                                        <TextInput label={<Text fw={700}>Email</Text>} {...register('email')} disabled />
                                    </Stack>
                                    <Button type="submit" size="lg" color="#515977" loading={isSubmitting}>
                                        {isSubmitting ? "Saving..." : "Save"}
                                    </Button>
                                </Stack>
                            </form>
                        </Drawer.Body>
                    </Drawer.Content>
                </Drawer.Root>
            </Drawer.Stack>


            <SimpleGrid cols={4} >
                {EMPLOYEES.map(({ id, first_name, last_name, department, email, }) => (
                    <Paper key={id} radius={'md'} p={'xl'} onClick={() => details(first_name, last_name, email, department.name)}>

                        <Group gap={'md'}>
                            <Avatar size={'lg'}>{first_name[0]}</Avatar>
                            <Box>
                                <Text size="xs">{department.name}</Text>
                                <Text size="sm" fw={700}>{`${first_name} ${last_name}`}</Text>
                            </Box>
                        </Group>

                    </Paper>
                ))}
            </SimpleGrid>
        </>
    )
}


const Employees = () => {

    const { control, watch, setValue: setDepartmentValue } = useForm({ defaultValues: { department: '' } });
    const selectedDepartment = watch('department');

    const { data: DEPARTMENT, isError: noDEPARTMENT, isLoading: isFETCHINGDEPARTMENT, refetch: REFETCH_DEPARTMENT } = useQuery({
        queryKey: ['DEPARTMENT'],
        queryFn: async () => {
            const res = await api.get('department')
            return res.data
        }
    })

    if (isFETCHINGDEPARTMENT) {
        console.log('fetching...')
        return
    }

    if (noDEPARTMENT) {
        console.log('no department')
        return
    }

    const DEPARTMENT_NAMES = DEPARTMENT.map(({ name }) => name)

    return (
        <Box>
            <Paper shadow="md" radius="md" px="xl" py="md">
                <Flex direction="row" justify="space-between" align="center">
                    <Box>
                        <form>
                            <Flex direction="row" align="center" gap={56}>
                                <Title order={4} fw={700}>
                                    Department
                                </Title>
                                <Controller
                                    name="department"
                                    control={control}
                                    render={({ field }) => (
                                        <NativeSelect
                                            {...field}
                                            radius="lg"
                                            style={{ width: '300px' }}
                                            size="md"
                                            rightSection={<IconChevronDown size={16} />}
                                            onChange={(e) => {
                                                field.onChange(e.target.value)
                                                setDepartmentValue('department', e.target.value)
                                            }}
                                        >
                                            <option value=''>Select Department</option>
                                            {DEPARTMENT_NAMES.map((item) => (
                                                <option key={item} value={item}>{item}</option>
                                            ))}
                                        </NativeSelect>
                                    )}
                                />
                            </Flex>
                        </form>
                    </Box>
                    <Flex gap={24} align="center">

                        {/* <Button color="#82BC66" size="md" radius="xl" onClick={openAddDepartment}>
                            + Department
                        </Button> */}
                        <InviteEmployee departments={DEPARTMENT_NAMES} />
                        <AddDepartment refetch={REFETCH_DEPARTMENT} />
                    </Flex>
                </Flex>
            </Paper>
            <Stack my="sm" gap={'sm'}>
                <PARTICIPATION_RATE department={selectedDepartment} />
                <EMPLOYEE_CARD department_names={DEPARTMENT_NAMES} department={selectedDepartment} />
            </Stack>
        </Box>
    );
};

export default Employees;
