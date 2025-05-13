import { Box, Button, Drawer, Flex, NativeSelect, Stack, Text, TextInput, useDrawersStack } from "@mantine/core";
import { Dropzone } from "@mantine/dropzone";
import { useDisclosure } from "@mantine/hooks";
import { IconChevronDown, IconCloudUpload, IconDownload, IconX } from "@tabler/icons-react";
import { useForm } from "react-hook-form";
import api from "../../../api/api";
import { useState } from "react";

export default function index({ departments }: any) {
    const [openedEmployeeInvite, { open, close }] = useDisclosure(false);
    const stack = useDrawersStack(['batch-upload']);
    const { register, handleSubmit, formState: { errors, isSubmitting, isSubmitSuccessful }, reset } = useForm({
        defaultValues: {
            first_name: "",
            last_name: "",
            email: "",
            department: ""
        }
    })

    const inviteEmployee = async (data) => {
        try {
            const res = await api.post('hr-admin/employees', data)
            reset()
            return res.data
        } catch (e) {
            console.log(e)
        }
    }

    return (
        <>
            <Drawer.Stack>
                {/* Batch Upload Drawer */}
                {/* <Drawer position="right" {...stack.register('batch-upload')}>
                    <form onSubmit={handleBatchSubmit(submitBatchUpload)}>
                        <Stack gap="md" p="md">
                            <Dropzone openRef={openRef} onDrop={handleDrop} accept={['text/csv']} maxSize={30 * 1024 ** 2}>
                                <div style={{ pointerEvents: 'none' }}>
                                    <Flex justify="center">
                                        <Dropzone.Accept>
                                            <IconDownload size={50} color={'blue'} stroke={1.5} />
                                        </Dropzone.Accept>
                                        <Dropzone.Reject>
                                            <IconX size={50} color={'red'} stroke={1.5} />
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
                                </div>
                            </Dropzone>
                            <Button type="submit" variant="filled" color="gray" loading={isButtonLoading}>
                                Batch Invite
                            </Button>
                        </Stack>
                    </form>
                </Drawer> */}

                {/* Invite Employee Drawer */}
                <Drawer.Root key={1} position="right" size="md" opened={openedEmployeeInvite} onClose={close}>
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
                                <form onSubmit={handleSubmit(inviteEmployee)} style={{ height: '100%' }}>
                                    <Flex direction="column" gap="md" justify="space-between" h="100%" mt="md">
                                        <Flex direction="column" gap="sm">
                                            <Box>
                                                <NativeSelect
                                                    {...register('department', { required: 'Department name is required' })}
                                                    radius="md"
                                                    label={<Text mb="xs" fw={700}>Department</Text>}
                                                    style={{ width: '100%' }}
                                                    size="md"
                                                    rightSection={<IconChevronDown size={16} />}
                                                >

                                                    <option value=''>Select Department</option>
                                                    {departments.map((item: string) => (
                                                        <option key={item} value={item}>{item}</option>
                                                    ))}
                                                </NativeSelect>
                                                {errors.department && <Text c={'red'}>{errors.department.message}</Text>}
                                            </Box>
                                            <Box>
                                                <TextInput {...register('first_name', { required: 'First name is required' })} label={<Text fw={700}>First Name</Text>} />
                                                {errors.first_name && <Text c={'red'}>{errors.first_name.message}</Text>}
                                            </Box>
                                            <Box>
                                                <TextInput {...register('last_name', { required: 'Last name is required' })} label={<Text fw={700}>Last Name</Text>} />
                                                {errors.last_name && <Text c={'red'}>{errors.last_name.message}</Text>}
                                            </Box>
                                            <Box>
                                                <TextInput
                                                    {...register('email', { required: 'Email is required' })}
                                                    label={<Text fw={700}>Company Email</Text>}
                                                />
                                                {errors.email && <Text c={'red'}>{errors.email.message}</Text>}
                                            </Box>

                                            <Text ta="left" size="sm">
                                                Newly added employees will receive a notification to sign up on our Wellbe companion app and receive company updates.
                                            </Text>
                                        </Flex>
                                        <Stack>
                                            {isSubmitSuccessful && <Text c='green'>Invite Success!</Text>}
                                            <Button type="submit" disabled={isSubmitting} size="lg" color="#515977">
                                                {isSubmitting ? 'Sending Invite...' : 'Invite'}
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

            </Drawer.Stack>
            <Button color="#515977" size="md" radius="xl" onClick={open}>
                + Invite
            </Button>
        </>

    )
}