import {
    Box,
    Button,
    Drawer,
    Flex,
    Group,
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
import { IconChevronDown } from '@tabler/icons-react';
import { useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useDisclosure } from '@mantine/hooks';
import { useMutation, useQuery } from 'react-query';
import {
    addDepartment,
    getEmployees,
    getParticipationRate,
    sendEmail,
} from '../../api/apiService';
import ParticipationRate from '../../components/DataVisualization/ParticipationRate';
import EmployeeDepartment from '../../components/EmployeeDepartment';
import { Dropzone } from '@mantine/dropzone';
import axios from 'axios';

const data = [
    { label: 'Human Resources Department', value: 'Human Resources' },
    { label: 'Engineering Department', value: 'Engineering' },
    { label: 'Marketing Department', value: 'Marketing' },
    { label: 'Finance Department', value: 'Finance' },
    { label: 'IT Department', value: 'Information Technology' },
];

const Employees = () => {
    // Disclosures for Invite and Add Department drawers
    const [
        openedEmployeeInvite,
        { open: openEmployeeInvite, close: closeEmployeeInvite },
    ] = useDisclosure(false);
    const [
        openedAddDepartment,
        { open: openAddDepartment, close: closeAddDepartment },
    ] = useDisclosure(false);
    const [notif, setNotif] = useState(false);
    const [errorNotif, setErrorNotif] = useState(false);

    // Form for department selection on main page
    const { control, watch } = useForm({
        defaultValues: {
            department: 'Human Resources',
        },
    });

    // Invite Employee Form
    const {
        register: registerEmployee,
        handleSubmit: submitInviteEmployee,
        setValue: inviteEmployeeForm,
        reset: resetInviteForm,
        setError: setInviteError,
        formState: { errors: inviteErrors },
    } = useForm({
        defaultValues: {
            department: 'Human Resources',
            firstName: '',
            lastName: '',
            email: '',
        },
    });

    // Add Department Form
    const {
        register: registerDepartment,
        handleSubmit: submitDepartment,
        reset: resetAddDepartment,
        formState: { isSubmitting: departmentSubmitting, errors: departmentErrors },
        setError: departmentError,
    } = useForm({
        defaultValues: {
            department: '',
            company: 'Positive Workplaces',
        },
    });

    const { mutateAsync: addNewDepartment } = useMutation({
        mutationFn: addDepartment,
    });

    const { mutateAsync: sendEmailToUser, isLoading: inviteSending } =
        useMutation({
            mutationFn: sendEmail,
            onSuccess: () => console.log('Email Sent'),
            onError: (e) => {
                if (e.status === 409) {
                    setInviteError('email', {
                        type: 'manual',
                        message: 'Account Already Registered!',
                    });
                }
            },
        });

    const submitForm = async (data) => {
        try {
            await sendEmailToUser(data);
            resetInviteForm();
            setNotif(true);
        } catch (error) {
            if (error?.status === 409) {
                setErrorNotif(true);
            }
        }
    };

    const submitNewDepartment = async (data) => {
        try {
            await addNewDepartment(data);
            resetAddDepartment();
        } catch (error) {
            if (error?.status === 409) {
                departmentError('department', {
                    type: 'manual',
                    message: 'Department Already Exist!',
                });
            }
        }
    };

    const selectedDepartment = watch('department');

    const { data: departmentData, isLoading: isDepartmentDataLoading } = useQuery(
        {
            queryKey: ['dataOfDepartment'],
            queryFn: getEmployees,
        }
    );

    // Notification timeouts
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

    // Batch Upload Drawer Stack
    const stack = useDrawersStack(['batch-upload']);
    const theme = useMantineTheme();
    const openRef = useRef<() => void>(null);
    const [fileName, setFileName] = useState<string | null>(null);

    // === Batch Upload Form using react-hook-form ===
    const {
        handleSubmit: handleBatchSubmit,
        setValue: setBatchValue,
        watch: watchBatch,
        reset: resetBatch,
        formState: { errors: batchErrors },
    } = useForm<{ file: File[] }>({
        defaultValues: { file: [] },
    });

    // Watch the batch upload file field
    const batchFileValue = watchBatch('file');

    // File drop handler for batch upload
    const handleDrop = (files: File[]) => {
        if (files.length > 0 && files[0].type === 'text/csv') {
            setBatchValue('file', files);
            setFileName(files[0].name);
        } else {
            setBatchValue('file', []);
            setFileName(null);
        }
    };

    // Batch Upload Submission Handler
    const onSubmit = async (values: { file: File[] }) => {
        if (values.file && values.file.length > 0) {
            const formData = new FormData();
            formData.append('file', values.file[0]);
            try {
                await axios.post(
                    '/api/company-admin/batchUploadPerformance?company=Positive Workplaces',
                    formData,
                    { headers: { 'Content-Type': 'multipart/form-data' } }
                );
                setNotif(true);
                resetBatch({ file: [] });
                setFileName(null);
            } catch (error) {
                console.error('Upload error:', error);
                setErrorNotif(true);
            }
        }
    };

    return (
        <Box>
            <Drawer.Stack>
                {/* Batch Upload Drawer */}
                <Drawer position="right" {...stack.register('batch-upload')}>
                    <form onSubmit={handleBatchSubmit(onSubmit)}>
                        <Stack gap="md" p="md">
                            <Dropzone
                                openRef={openRef}
                                onDrop={handleDrop}
                                accept={['text/csv']}
                                maxSize={30 * 1024 ** 2} // 30MB
                            >
                                <div style={{ pointerEvents: 'none' }}>
                                    <Group>
                                        <Dropzone.Accept>
                                            <Text>
                                                <IconChevronDown
                                                    size={50}
                                                    color={theme.colors.blue[6]}
                                                />
                                            </Text>
                                        </Dropzone.Accept>
                                        <Dropzone.Reject>
                                            <Text>
                                                <IconChevronDown
                                                    size={50}
                                                    color={theme.colors.red[6]}
                                                />
                                            </Text>
                                        </Dropzone.Reject>
                                        <Dropzone.Idle>
                                            <Text>
                                                <IconChevronDown size={50} stroke={1.5} />
                                            </Text>
                                        </Dropzone.Idle>
                                    </Group>

                                    <Text ta="center" fw={700} size="lg" mt="xl">
                                        <Dropzone.Accept>Drop CSV file here</Dropzone.Accept>
                                        <Dropzone.Reject>
                                            Only CSV files under 30MB are accepted
                                        </Dropzone.Reject>
                                        <Dropzone.Idle>Upload CSV File</Dropzone.Idle>
                                    </Text>
                                    {batchFileValue && batchFileValue.length > 0 ? (
                                        <Text ta="center" size="sm" mt="md" fw={600}>
                                            Uploaded file: {batchFileValue[0].name}
                                        </Text>
                                    ) : (
                                        <Text ta="center" size="sm" mt="xs" color="dimmed">
                                            Drag & drop a CSV file here. Only <i>.csv</i> files less
                                            than 30MB are accepted.
                                        </Text>
                                    )}
                                </div>
                            </Dropzone>
                            {batchErrors.file && (
                                <Text color="red" size="sm">
                                    {batchErrors.file.message || 'Please upload a CSV file'}
                                </Text>
                            )}
                            {notif && <Text c="green">Upload Success!</Text>}
                            {errorNotif && <Text c="red">Account already registered!</Text>}
                            <Button type="submit" variant="filled" color="gray">
                                Upload Performance Data
                            </Button>
                        </Stack>
                    </form>
                </Drawer>

                {/* Invite Employee Drawer */}
                <Drawer.Root
                    key={1}
                    position={'right'}
                    size={'md'}
                    opened={openedEmployeeInvite}
                    onClose={closeEmployeeInvite}
                >
                    <Drawer.Overlay />
                    <Drawer.Content>
                        <Drawer.Header style={{ backgroundColor: '#515977' }}>
                            <Drawer.Title style={{ color: 'white' }}>
                                <Text size="xl">Invite Employee</Text>
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
                                <form
                                    onSubmit={submitInviteEmployee(submitForm)}
                                    style={{ height: '100%' }}
                                >
                                    <Flex
                                        direction={'column'}
                                        gap={'md'}
                                        justify={'space-between'}
                                        h={'100%'}
                                        mt={'md'}
                                    >
                                        <Flex direction={'column'} gap={'sm'}>
                                            <NativeSelect
                                                radius={'md'}
                                                label={
                                                    <Text mb={'xs'} fw={700}>
                                                        Department
                                                    </Text>
                                                }
                                                style={{ width: '100%' }}
                                                size="md"
                                                data={data}
                                                defaultValue={selectedDepartment}
                                                rightSection={<IconChevronDown size={16} />}
                                                onChange={(e) => {
                                                    inviteEmployeeForm('department', e.target.value);
                                                }}
                                            />
                                            <TextInput
                                                {...registerEmployee('firstName')}
                                                label={<Text fw={700}>First Name</Text>}
                                            />
                                            <TextInput
                                                {...registerEmployee('lastName')}
                                                label={<Text fw={700}>Last Name</Text>}
                                            />
                                            <TextInput
                                                {...registerEmployee('email')}
                                                label={<Text fw={700}>Company Email</Text>}
                                                error={inviteErrors.email?.message}
                                            />
                                            {notif && <Text c={'green'}>Invite Success!</Text>}
                                            {errorNotif && (
                                                <Text c={'red'}>Account already registered!</Text>
                                            )}
                                            <Text ta={'left'} size="sm">
                                                Newly added employees will receive a notification to
                                                sign up on our Wellbe companion app and receive updates
                                                from your company
                                            </Text>
                                        </Flex>
                                        <Stack>
                                            <Button
                                                type="submit"
                                                disabled={inviteSending}
                                                size="lg"
                                                color="#515977"
                                            >
                                                {inviteSending ? 'Sending Invite...' : 'Invite'}
                                            </Button>
                                            <Button
                                                size="lg"
                                                color="#515977"
                                                onClick={() => stack.open('batch-upload')}
                                            >
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
                <Drawer.Root
                    key={2}
                    position={'right'}
                    size={'md'}
                    opened={openedAddDepartment}
                    onClose={closeAddDepartment}
                >
                    <Drawer.Overlay />
                    <Drawer.Content>
                        <Drawer.Header style={{ backgroundColor: '#515977' }}>
                            <Drawer.Title style={{ color: 'white' }}>
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
                                <form
                                    onSubmit={submitDepartment(submitNewDepartment)}
                                    style={{ height: '100%' }}
                                >
                                    <Flex
                                        direction={'column'}
                                        gap={'md'}
                                        justify={'space-between'}
                                        h={'100%'}
                                        mt={'md'}
                                    >
                                        <Box>
                                            <Text mb={'md'} fw={700}>
                                                Department Name
                                            </Text>
                                            <TextInput
                                                size="lg"
                                                {...registerDepartment('department', {
                                                    required: 'Department name is required',
                                                })}
                                                error={departmentErrors.department?.message}
                                            />
                                            <Text mt="md" size="sm">
                                                Employees in this department will be notified to
                                                download the Wellbe companion app and receive company
                                                updates.
                                            </Text>
                                        </Box>
                                        <Button
                                            disabled={departmentSubmitting}
                                            type="submit"
                                            size="lg"
                                            color="#515977"
                                        >
                                            {departmentSubmitting ? <Loader color="blue" /> : 'Save'}
                                        </Button>
                                    </Flex>
                                </form>
                            </Box>
                        </Drawer.Body>
                    </Drawer.Content>
                </Drawer.Root>
            </Drawer.Stack>

            <Paper shadow="md" radius="md" px="xl" py={'md'}>
                <Flex direction={'row'} justify={'space-between'} align={'center'}>
                    <Box>
                        <form>
                            <Flex direction={'row'} align={'center'} gap={56}>
                                <Title order={4} fw={700}>
                                    Department
                                </Title>
                                <Controller
                                    name="department"
                                    control={control}
                                    render={({ field }) => (
                                        <NativeSelect
                                            {...field}
                                            radius={'lg'}
                                            style={{ width: '300px' }}
                                            size="md"
                                            data={data}
                                            rightSection={<IconChevronDown size={16} />}
                                            onChange={(e) => {
                                                field.onChange(e.target.value);
                                            }}
                                        />
                                    )}
                                />
                            </Flex>
                        </form>
                    </Box>
                    <Flex gap={24} align={'center'}>
                        <Button
                            color="#515977"
                            size="md"
                            radius={'xl'}
                            onClick={openEmployeeInvite}
                        >
                            + Invite
                        </Button>
                        <Button
                            color="#82BC66"
                            size="md"
                            radius={'xl'}
                            onClick={openAddDepartment}
                        >
                            + Department
                        </Button>
                    </Flex>
                </Flex>
            </Paper>

            <ParticipationRate selectedDepartment={selectedDepartment} />

            {isDepartmentDataLoading ? (
                <div>loading component... </div>
            ) : (
                <EmployeeDepartment
                    dataToRender={departmentData?.data}
                    currentDepartment={selectedDepartment}
                    dropdownData={data}
                />
            )}
        </Box>
    );
};

export default Employees;
