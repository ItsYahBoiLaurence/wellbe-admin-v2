import { Box, Button, Drawer, Flex, Loader, NativeSelect, Paper, Text, TextInput, Title } from "@mantine/core"
import { IconChevronDown } from "@tabler/icons-react"
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form"
import { useDisclosure } from "@mantine/hooks";
import { useMutation, useQuery } from "react-query";
import { addDepartment, getEmployees, getParticipationRate, sendEmail } from "../../api/apiService";
import ParticipationRate from "../../components/DataVisualization/ParticipationRate";
import EmployeeDepartment from "../../components/EmployeeDepartment";

const departments = [
    {
        id: 1,
        name: "Finance",
        employees: [
            { id: 101, name: "John Laurence Burgos", position: "Financial Analyst", email: "john.burgos@example.com" },
            { id: 102, name: "Andrew Santos", position: "Accountant", email: "andrew.santos@example.com" },
            { id: 103, name: "Cathie Alcala", position: "Budget Officer", email: "cathie.alcala@example.com" },
            { id: 104, name: "Kim Montano", position: "Auditor", email: "kim.montano@example.com" },
            { id: 105, name: "Lucas Morales", position: "Tax Specialist", email: "lucas.morales@example.com" },
            { id: 106, name: "Sophia Lim", position: "Treasury Officer", email: "sophia.lim@example.com" },
            { id: 107, name: "Daniel Cruz", position: "Financial Controller", email: "daniel.cruz@example.com" },
            { id: 108, name: "Olivia Reyes", position: "Cost Accountant", email: "olivia.reyes@example.com" },
            { id: 109, name: "Ethan Torres", position: "Internal Auditor", email: "ethan.torres@example.com" },
            { id: 110, name: "Mia Mendoza", position: "Payroll Specialist", email: "mia.mendoza@example.com" },
        ],
    },
    {
        id: 2,
        name: "Human Resources",
        employees: [
            { id: 201, name: "Earl Jei Burgos", position: "HR Manager", email: "earl.burgos@example.com" },
            { id: 202, name: "Samantha Cruz", position: "Recruitment Specialist", email: "samantha.cruz@example.com" },
            { id: 203, name: "Henry Tan", position: "Training Coordinator", email: "henry.tan@example.com" },
            { id: 204, name: "Sophia Lim", position: "Employee Relations Officer", email: "sophia.lim@example.com" },
            { id: 205, name: "James Mendoza", position: "HR Analyst", email: "james.mendoza@example.com" },
            { id: 206, name: "Maria Santos", position: "Compensation Manager", email: "maria.santos@example.com" },
            { id: 207, name: "David Garcia", position: "Benefits Coordinator", email: "david.garcia@example.com" },
            { id: 208, name: "Emma Lopez", position: "Diversity Specialist", email: "emma.lopez@example.com" },
            { id: 209, name: "William Reyes", position: "HR Consultant", email: "william.reyes@example.com" },
            { id: 210, name: "Isabella Cruz", position: "Onboarding Specialist", email: "isabella.cruz@example.com" },
        ],
    },
    {
        id: 3,
        name: "Engineering",
        employees: [
            { id: 301, name: "Michael Lee", position: "Software Engineer", email: "michael.lee@example.com" },
            { id: 302, name: "Sara Kim", position: "Mechanical Engineer", email: "sara.kim@example.com" },
            { id: 303, name: "Daniel Tan", position: "Electrical Engineer", email: "daniel.tan@example.com" },
            { id: 304, name: "Emma Johnson", position: "Civil Engineer", email: "emma.johnson@example.com" },
            { id: 305, name: "Liam Garcia", position: "Project Manager", email: "liam.garcia@example.com" },
            { id: 306, name: "Noah Davis", position: "Data Scientist", email: "noah.davis@example.com" },
            { id: 307, name: "Sophia Lee", position: "DevOps Engineer", email: "sophia.lee@example.com" },
            { id: 308, name: "Mason Wilson", position: "Test Engineer", email: "mason.wilson@example.com" },
            { id: 309, name: "Lucas Brown", position: "Network Engineer", email: "lucas.brown@example.com" },
            { id: 310, name: "Isabella Martinez", position: "AI Specialist", email: "isabella.martinez@example.com" },
        ],
    },
    {
        id: 4,
        name: "Marketing",
        employees: [
            { id: 401, name: "Olivia White", position: "Marketing Manager", email: "olivia.white@example.com" },
            { id: 402, name: "Aiden Hill", position: "SEO Specialist", email: "aiden.hill@example.com" },
            { id: 403, name: "Mia Taylor", position: "Content Writer", email: "mia.taylor@example.com" },
            { id: 404, name: "Ethan Evans", position: "Graphic Designer", email: "ethan.evans@example.com" },
            { id: 405, name: "Ava Scott", position: "Social Media Manager", email: "ava.scott@example.com" },
            { id: 406, name: "Lucas Adams", position: "Email Marketing Specialist", email: "lucas.adams@example.com" },
            { id: 407, name: "Sophia Rivera", position: "Brand Manager", email: "sophia.rivera@example.com" },
            { id: 408, name: "James Thomas", position: "Market Research Analyst", email: "james.thomas@example.com" },
            { id: 409, name: "Charlotte Lewis", position: "PR Specialist", email: "charlotte.lewis@example.com" },
            { id: 410, name: "Amelia Young", position: "Advertising Coordinator", email: "amelia.young@example.com" },
        ],
    },
];

const data = [
    { label: 'Human Resources Department', value: 'Human Resources' },
    { label: 'Engineering Department', value: 'Engineering' },
    { label: 'Marketing Department', value: 'Marketing' },
    { label: 'Finance Department', value: 'Finance' },
    { label: 'IT Department', value: 'Information Technology' }

]

const Employees = () => {

    const [openedEmployeeInvite, { open: openEmployeeInvite, close: closeEmployeeInvite }] = useDisclosure(false);
    const [openedAddDepartment, { open: openAddDepartment, close: closeAddDepartment }] = useDisclosure(false);
    const [notif, setNotif] = useState(false)
    const [errorNotif, setErrorNotif] = useState(false)
    const { control, watch } = useForm({
        defaultValues: {
            department: "Human Resources"
        }
    })

    const { register: registerEmployee,
        handleSubmit: submitInviteEmployee,
        setValue: inviteEmployeeForm,
        reset: resetInviteForm,
        formState: { errors: inviteError },
        setError: setInviteError
    } = useForm({
        defaultValues: {
            department: 'Human Resources',
            firstName: '',
            lastName: '',
            email: ''
        }
    });


    const { register: registerDepartment,
        handleSubmit: submitDepartment,
        reset: resetAddDepartment,
        formState: {
            isSubmitting: departmentSubmitting,
            errors
        },
        setError: departmentError
    } = useForm({
        defaultValues: {
            department: '',
            company: 'Mayan Solutions Inc.'
        }
    })


    const { mutateAsync: addNewDepartment } = useMutation({
        mutationFn: addDepartment
    })

    const { mutateAsync: sendEmailToUser, isLoading: inviteSending } = useMutation({
        mutationFn: sendEmail,
        onSuccess: () => console.log('Email Sent'),
        onError: (e) => {
            if (e.status == 409) {
                setInviteError('email', {
                    type: 'manual',
                    message: 'Account Already Registered!'
                })
            }
        }
    })


    const submitForm = async (data) => {
        console.log(data)
        try {
            await sendEmailToUser(data)
            resetInviteForm()
            setNotif(true)
        } catch (error) {
            if (error?.status === 409) {
                setErrorNotif(true)
            }
        }
    }

    const submitNewDepartment = async (data) => {
        try {
            await addNewDepartment(data)
            resetAddDepartment()
        } catch (error) {
            if (error?.status === 409) {
                departmentError('department', {
                    type: 'manual',
                    message: 'Department Already Exist!'
                })
            }
        }
    }


    const selectedDepartment = watch('department')



    const { data: departmentData, isLoading: isDepartmentDataLoading } = useQuery({
        queryKey: ['dataOfDepartment'],
        queryFn: getEmployees
    })

    useEffect(() => {
        setTimeout(() => {
            setNotif(false)
        }, 5000)
    }, [notif])

    useEffect(() => {
        setTimeout(() => {
            setErrorNotif(false)
        }, 5000)
    }, [errorNotif])

    return (
        <Box>
            <Drawer.Stack>
                {/* Invite */}
                <Drawer.Root
                    key={1}
                    position={'right'}
                    size={'md'}
                    opened={openedEmployeeInvite} onClose={closeEmployeeInvite}
                >
                    <Drawer.Overlay />
                    <Drawer.Content>
                        <Drawer.Header style={{ backgroundColor: '#515977' }}>
                            <Drawer.Title style={{ color: 'white', }}>
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
                                <form onSubmit={submitInviteEmployee(submitForm)} style={{ height: '100%' }}>
                                    <Flex direction={'column'} gap={'md'} justify={'space-between'} h={'100%'} mt={'md'}>
                                        <Flex direction={'column'} gap={'lg'}>
                                            <NativeSelect radius={'md'}
                                                label={<Text mb={'xs'} fw={700}>Department</Text>}
                                                style={{ width: '100%' }}
                                                size='md'
                                                data={data}
                                                defaultValue={selectedDepartment}
                                                rightSection={<IconChevronDown size={16} />}
                                                onChange={(e) => {
                                                    inviteEmployeeForm('department', e.target.value)
                                                }}>
                                            </NativeSelect>
                                            <TextInput  {...registerEmployee('firstName')}
                                                label={<Text mb={'xs'} fw={700}>
                                                    First Name
                                                </Text>} />
                                            <TextInput  {...registerEmployee('lastName')}
                                                label={<Text mb={'xs'} fw={700}>
                                                    Last Name
                                                </Text>} />
                                            <TextInput {...registerEmployee('email')}
                                                label={<Text mb={'xs'} fw={700}>
                                                    Company Email
                                                </Text>}
                                                error={errors.email?.meesage}
                                            />
                                            {notif && <Text c={'green'}>Invite Success!</Text>}
                                            {errorNotif && <Text c={'red'}>Account already registered!</Text>}
                                            <Text ta={'center'} size="sm">
                                                Newly added employees will receive a notification to download our Well be companion app and receives updates from your company
                                            </Text>
                                        </Flex>
                                        <Button type="submit" disabled={inviteSending} size="lg" color="#515977">
                                            Save
                                        </Button>
                                    </Flex>
                                </form>
                            </Box>
                        </Drawer.Body>
                    </Drawer.Content>
                </Drawer.Root>
                {/* Add Department */}
                <Drawer.Root
                    key={2}
                    position={'right'}
                    size={'md'}
                    opened={openedAddDepartment} onClose={closeAddDepartment}
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
                                <form onSubmit={submitDepartment(submitNewDepartment)} style={{ height: '100%' }}>
                                    <Flex direction={'column'} gap={'md'} justify={'space-between'} h={'100%'} mt={'md'}>
                                        <Box>
                                            <Text mb={'md'} fw={700}>
                                                Department Name
                                            </Text>
                                            <TextInput size="lg" {...registerDepartment('department', {
                                                required: 'Departmet name is required',
                                            })
                                            }
                                                error={errors.department?.message} />
                                            <Text mt="md" size="sm">Employees in this department will be notified  to download the Wellbe companion app  and receives company update. </Text>
                                        </Box>
                                        <Button disabled={departmentSubmitting} type="submit" size="lg" color="#515977">
                                            {departmentSubmitting ? <Loader color="blue" /> : "Save"}
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
                                <Title order={4} fw={700}>Department</Title>
                                <Controller
                                    name='department'
                                    control={control}
                                    render={({ field }) => (
                                        <NativeSelect
                                            {...field}
                                            radius={'lg'}
                                            style={{ width: '300px' }}
                                            size='md'
                                            data={data}
                                            rightSection={<IconChevronDown size={16} />}
                                            onChange={(e) => {
                                                field.onChange(e.target.value)
                                            }}
                                        />
                                    )}
                                />
                            </Flex>
                        </form>
                    </Box>
                    <Flex gap={24} align={'center'}>
                        <Button color="#515977" size="md" radius={'xl'} onClick={openEmployeeInvite}  >+ Invite</Button>
                        <Button color="#82BC66" size="md" radius={'xl'} onClick={openAddDepartment}>+ Department</Button>
                    </Flex>
                </Flex>
            </Paper >
            <ParticipationRate selectedDepartment={selectedDepartment} />
            {isDepartmentDataLoading ? <div>loading component... </div> : <EmployeeDepartment dataToRender={departmentData?.data} currentDepartment={selectedDepartment} dropdownData={data} />}
        </Box>
    )
}

export default Employees