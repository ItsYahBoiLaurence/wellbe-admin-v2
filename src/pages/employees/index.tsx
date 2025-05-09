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

const staticDepartmentOptions = [
    { label: 'No Department Available', value: '' },
];

const transformDepartmentData = (data: any[]): { label: string; value: string }[] =>
    Array.isArray(data)
        ? data.map((department) => ({ label: department, value: department }))
        : [];



const EMPLOYEE_CARD = ({ department }) => {
    const { data: EMPLOYEES, isError: noEMPLOYEES, isLoading: isFETCHINGEMPLOYEES } = useQuery({
        queryKey: ['EMPLOYEES', department],
        queryFn: async ({ queryKey }) => {
            const [, department] = queryKey
            console.log(department)

            if (!department || department === "") {
                const res = await api.get('hr-admin/employees');
                return res.data
            }
            const res = await api.get('hr-admin/employees', { params: { department } });
            return res.data
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

    return (
        <SimpleGrid cols={4} >
            {EMPLOYEES.map(({ id, first_name, last_name, department }) => (
                <Paper key={id} radius={'md'} p={'xl'}>
                    <Center h={'100%'}>
                        <Group gap={'md'}>
                            <Avatar size={'lg'}>{first_name[0]}</Avatar>
                            <Box>
                                <Text size="xs">{department.name}</Text>
                                <Text size="md" fw={700}>{`${first_name} ${last_name}`}</Text>
                            </Box>
                        </Group>
                    </Center>
                </Paper>
            ))}
        </SimpleGrid>
    )
}

const Employees = () => {
    // Disclosures for Invite Employee and Add Department drawers

    // Notification state
    const [notif, setNotif] = useState(false);
    const [errorNotif, setErrorNotif] = useState(false);
    const [isButtonLoading, setIsButtonLoading] = useState(false)


    // Main page department selection form
    const { control, watch, setValue: setDepartmentValue } = useForm({ defaultValues: { department: '' } });
    const selectedDepartment = watch('department');

    // Invite Employee form
    const inviteForm = useForm({
        defaultValues: { department: selectedDepartment, firstName: '', lastName: '', email: '', role: 'employee' },
    });

    const {
        register: registerEmployee,
        handleSubmit: handleSubmitInvite,
        setValue: setInviteValue,
        reset: resetInviteForm,
        setError: setInviteError,
        formState: { errors: inviteErrors },
    } = inviteForm;
    const company = localStorage.getItem('USER_COMPANY')
    // Add Department form
    const departmentForm = useForm({
        defaultValues: { department: '', company: company },
    });
    const {
        register: registerDepartment,
        handleSubmit: handleSubmitDepartment,
        reset: resetDepartmentForm,
        formState: { isSubmitting: departmentSubmitting, errors: departmentErrors },
        setError: setDepartmentError,
    } = departmentForm;

    // Batch Upload form
    const batchForm = useForm<{ file: File[] }>({ defaultValues: { file: [] } });
    const {
        handleSubmit: handleBatchSubmit,
        setValue: setBatchValue,
        watch: watchBatch,
        reset: resetBatch,
        formState: { errors: batchErrors },
    } = batchForm;
    const batchFileValue = watchBatch('file');
    const [fileName, setFileName] = useState<string | null>(null);

    // React Query mutations
    const { mutateAsync: addNewDepartment } = useMutation(addDepartment);
    const { mutateAsync: sendEmailToUser, isLoading: inviteSending } = useMutation(sendEmail, {
        onSuccess: () => console.log('Email Sent'),
        onError: (e: any) => {
            if (e.status === 409) {
                setInviteError('email', { type: 'manual', message: 'Account Already Registered!' });
            }
        },
    });

    // Fetch employee data
    const { data: departmentData } = useQuery({
        queryKey: ['dataOfDepartment'],
        queryFn: getEmployees,
    });

    // Fetch all departments (to populate the dropdown)
    const { data: allDepartments, refetch: refetchDepartment } = useQuery({
        queryKey: ['AllDepartmentInCompany'],
        queryFn: getAllDepartments,
    });
    // Use the transformed data if available, otherwise fallback to static options.
    const departmentOptionsFromApi = allDepartments
        ? transformDepartmentData(allDepartments)
        : staticDepartmentOptions;

    // Clear notifications after 5 seconds
    useEffect(() => {
        if (notif) {
            const timer = setTimeout(() => setNotif(false), 5000);
            return () => clearTimeout(timer);
        }
    }, [notif]);

    useEffect(() => {
        if (errorNotif) {
            const timer = setTimeout(() => setErrorNotif(false), 5000);
            return () => clearTimeout(timer);
        }
    }, [errorNotif]);

    // Batch Upload Drawer stack and theming
    const stack = useDrawersStack(['batch-upload']);
    const theme = useMantineTheme();
    const openRef = useRef<() => void>(null);

    // Handle file drop for batch upload
    const handleDrop = (files: File[]) => {
        if (files.length > 0 && files[0].type === 'text/csv') {
            setBatchValue('file', files);
            setFileName(files[0].name);
        } else {
            setBatchValue('file', []);
            setFileName(null);
        }
    };

    // Submit handlers
    const submitInvite = async (data: any) => {
        try {
            await sendEmailToUser(data);
            resetInviteForm();
            setNotif(true);
        } catch (error: any) {
            if (error?.status === 409) setErrorNotif(true);
        }
    };

    const submitBatchUpload = async (values: { file: File[] }) => {
        if (!values.file.length) return;
        const formData = new FormData();
        formData.append('file', values.file[0]);
        try {
            setIsButtonLoading(true)
            await api.post(`/api/company-admin/batchUploadInvite?company=${company}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setNotif(true);
            resetBatch({ file: [] });
            setFileName(null);
            setIsButtonLoading(false)
        } catch (error) {
            console.error('Upload error:', error);
            setErrorNotif(true);
        }
    };


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

            <Box my="md" >
                <EMPLOYEE_CARD department={selectedDepartment} />
            </Box>
        </Box>
    );
};

export default Employees;
