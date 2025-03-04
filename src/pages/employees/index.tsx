import {
    Box,
    Button,
    Center,
    Drawer,
    Flex,
    Loader,
    NativeSelect,
    Paper,
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
import ParticipationRate from '../../components/DataVisualization/ParticipationRate';
import EmployeeDepartment from '../../components/EmployeeDepartment';
import { Dropzone } from '@mantine/dropzone';
import api from '../../api/api';

const staticDepartmentOptions = [
    { label: 'Human Resources Department', value: 'Human Resources' },
];

const transformDepartmentData = (data: any[]): { label: string; value: string }[] =>
    Array.isArray(data)
        ? data.map((department) => ({ label: department, value: department }))
        : [];

const Employees = () => {
    // Disclosures for Invite Employee and Add Department drawers
    const [openedEmployeeInvite, { open: openEmployeeInvite, close: closeEmployeeInvite }] = useDisclosure(false);
    const [openedAddDepartment, { open: openAddDepartment, close: closeAddDepartment }] = useDisclosure(false);

    // Notification state
    const [notif, setNotif] = useState(false);
    const [errorNotif, setErrorNotif] = useState(false);

    // Main page department selection form
    const { control, watch } = useForm({ defaultValues: { department: 'Sales & Marketing' } });
    const selectedDepartment = watch('department');

    // Invite Employee form
    const inviteForm = useForm({
        defaultValues: { department: 'Human Resources', firstName: '', lastName: '', email: '' },
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
    const { data: departmentData, isLoading: isDepartmentDataLoading } = useQuery({
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

    const submitDepartment = async (data: any) => {
        try {
            await addNewDepartment(data);
            resetDepartmentForm();
            refetchDepartment()
        } catch (error: any) {
            if (error?.status === 409) {
                setDepartmentError('department', { type: 'manual', message: 'Department Already Exist!' });
            }
        }
    };

    const submitBatchUpload = async (values: { file: File[] }) => {
        if (!values.file.length) return;
        const formData = new FormData();
        formData.append('file', values.file[0]);
        try {
            await api.post(`/api/company-admin/batchUploadInvite?company=${company}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setNotif(true);
            resetBatch({ file: [] });
            setFileName(null);
        } catch (error) {
            console.error('Upload error:', error);
            setErrorNotif(true);
        }
    };

    return (
        <Box>
            <Drawer.Stack>
                {/* Batch Upload Drawer */}
                <Drawer position="right" {...stack.register('batch-upload')}>
                    <form onSubmit={handleBatchSubmit(submitBatchUpload)}>
                        <Stack gap="md" p="md">
                            <Dropzone openRef={openRef} onDrop={handleDrop} accept={['text/csv']} maxSize={30 * 1024 ** 2}>
                                <div style={{ pointerEvents: 'none' }}>
                                    <Flex justify="center">
                                        <Dropzone.Accept>
                                            <IconDownload size={50} color={theme.colors.blue[6]} stroke={1.5} />
                                        </Dropzone.Accept>
                                        <Dropzone.Reject>
                                            <IconX size={50} color={theme.colors.red[6]} stroke={1.5} />
                                        </Dropzone.Reject>
                                        <Dropzone.Idle>
                                            <IconCloudUpload size={50} stroke={1.5} />
                                        </Dropzone.Idle>
                                    </Flex>
                                    <Text ta="center" fw={700} size="lg" mt="xl">
                                        <Dropzone.Accept>Drop CSV file here</Dropzone.Accept>
                                        <Dropzone.Reject>Only CSV files under 30MB are accepted</Dropzone.Reject>
                                        <Dropzone.Idle>Upload CSV File</Dropzone.Idle>
                                    </Text>
                                    {batchFileValue && batchFileValue.length > 0 ? (
                                        <Text ta="center" size="sm" mt="md" fw={600}>
                                            Uploaded file: {batchFileValue[0].name}
                                        </Text>
                                    ) : (
                                        <Text ta="center" size="sm" mt="xs" color="dimmed">
                                            Drag & drop a CSV file here. Only <i>.csv</i> files less than 30MB are accepted.
                                        </Text>
                                    )}
                                </div>
                            </Dropzone>
                            {batchErrors.file && (
                                <Text color="red" size="sm">
                                    {batchErrors.file.message || 'Please upload a CSV file'}
                                </Text>
                            )}
                            {notif && <Text color="green">Upload Success!</Text>}
                            {errorNotif && <Text color="red">Failed to Invite! Check the CSV format and try again.</Text>}
                            <Button type="submit" variant="filled" color="gray">
                                Batch Invite
                            </Button>
                        </Stack>
                    </form>
                </Drawer>

                {/* Invite Employee Drawer */}
                <Drawer.Root key={1} position="right" size="md" opened={openedEmployeeInvite} onClose={closeEmployeeInvite}>
                    <Drawer.Overlay />
                    <Drawer.Content>
                        <Drawer.Header sx={{ backgroundColor: '#515977' }}>
                            <Drawer.Title sx={{ color: 'white' }}>
                                <Text size="xl">Invite Employee</Text>
                            </Drawer.Title>
                            <Drawer.CloseButton
                                sx={{ color: 'white', background: 'none', border: 'none', boxShadow: 'none', cursor: 'pointer' }}
                            />
                        </Drawer.Header>
                        <Drawer.Body h="90%">
                            <Box h="95%">
                                <form onSubmit={handleSubmitInvite(submitInvite)} style={{ height: '100%' }}>
                                    <Flex direction="column" gap="md" justify="space-between" h="100%" mt="md">
                                        <Flex direction="column" gap="sm">
                                            <NativeSelect
                                                radius="md"
                                                label={<Text mb="xs" fw={700}>Department</Text>}
                                                style={{ width: '100%' }}
                                                size="md"
                                                data={departmentOptionsFromApi}
                                                defaultValue={selectedDepartment}
                                                rightSection={<IconChevronDown size={16} />}
                                                onChange={(e) => setInviteValue('department', e.target.value)}
                                            />
                                            <TextInput {...registerEmployee('firstName')} label={<Text fw={700}>First Name</Text>} />
                                            <TextInput {...registerEmployee('lastName')} label={<Text fw={700}>Last Name</Text>} />
                                            <TextInput
                                                {...registerEmployee('email')}
                                                label={<Text fw={700}>Company Email</Text>}
                                                error={inviteErrors.email?.message}
                                            />
                                            {notif && <Text color="green">Invite Success!</Text>}
                                            {errorNotif && <Text color="red">Account already registered!</Text>}
                                            <Text ta="left" size="sm">
                                                Newly added employees will receive a notification to sign up on our Wellbe companion app and receive company updates.
                                            </Text>
                                        </Flex>
                                        <Stack>
                                            <Button type="submit" disabled={inviteSending} size="lg" color="#515977">
                                                {inviteSending ? 'Sending Invite...' : 'Invite'}
                                            </Button>
                                            <Button size="lg" color="#515977" onClick={() => stack.open('batch-upload')}>
                                                Use Batch Upload
                                            </Button>
                                        </Stack>
                                    </Flex>
                                </form>
                            </Box>
                        </Drawer.Body>
                    </Drawer.Content>
                </Drawer.Root>

                {/* Add Department Drawer */}
                <Drawer.Root key={2} position="right" size="md" opened={openedAddDepartment} onClose={closeAddDepartment}>
                    <Drawer.Overlay />
                    <Drawer.Content>
                        <Drawer.Header sx={{ backgroundColor: '#515977' }}>
                            <Drawer.Title sx={{ color: 'white' }}>
                                <Text size="xl">Manage Employee</Text>
                            </Drawer.Title>
                            <Drawer.CloseButton
                                sx={{ color: 'white', background: 'none', border: 'none', boxShadow: 'none', cursor: 'pointer' }}
                            />
                        </Drawer.Header>
                        <Drawer.Body h="90%">
                            <Box h="95%">
                                <form onSubmit={handleSubmitDepartment(submitDepartment)} style={{ height: '100%' }}>
                                    <Flex direction="column" gap="md" justify="space-between" h="100%" mt="md">
                                        <Box>
                                            <Text mb="md" fw={700}>Department Name</Text>
                                            <TextInput
                                                size="lg"
                                                {...registerDepartment('department', { required: 'Department name is required' })}
                                                error={departmentErrors.department?.message}
                                            />
                                            <Text mt="md" size="sm">
                                                Employees in this department will be notified to download the Wellbe companion app and receive company updates.
                                            </Text>
                                        </Box>
                                        <Button disabled={departmentSubmitting} type="submit" size="lg" color="#515977">
                                            {departmentSubmitting ? <Loader color="blue" /> : 'Save'}
                                        </Button>
                                    </Flex>
                                </form>
                            </Box>
                        </Drawer.Body>
                    </Drawer.Content>
                </Drawer.Root>
            </Drawer.Stack>

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
                                            data={departmentOptionsFromApi}
                                            rightSection={<IconChevronDown size={16} />}
                                            onChange={(e) => field.onChange(e.target.value)}
                                        />
                                    )}
                                />
                            </Flex>
                        </form>
                    </Box>
                    <Flex gap={24} align="center">
                        <Button color="#515977" size="md" radius="xl" onClick={openEmployeeInvite}>
                            + Invite
                        </Button>
                        <Button color="#82BC66" size="md" radius="xl" onClick={openAddDepartment}>
                            + Department
                        </Button>
                    </Flex>
                </Flex>
            </Paper>

            <ParticipationRate selectedDepartment={selectedDepartment} />
            <Box>
                {departmentData?.data === null && departmentData?.data === undefined ? <Paper><Center><Text>No data available!</Text></Center></Paper> : (
                    <EmployeeDepartment
                        dataToRender={departmentData?.data}
                        currentDepartment={selectedDepartment}
                        dropdownData={staticDepartmentOptions}
                    />
                )}
            </Box>

        </Box>
    );
};

export default Employees;
