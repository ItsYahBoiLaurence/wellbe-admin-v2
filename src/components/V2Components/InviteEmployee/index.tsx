import { Box, Button, Drawer, Flex, NativeSelect, Stack, Text, TextInput, useDrawersStack } from "@mantine/core";
import { Dropzone, DropzoneAccept } from "@mantine/dropzone";
import { useDisclosure } from "@mantine/hooks";
import { IconChevronDown, IconCloudUpload, IconDownload, IconX } from "@tabler/icons-react";
import { Controller, useForm } from "react-hook-form";
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

    const { control: FILE_CONTROL, handleSubmit: FILESUBMIT, reset: RESET_FILE, formState: { isSubmitting: FILE_SUBMITTING, isSubmitSuccessful: isSUCCESS_UPLOAD } } = useForm<{ files: [] }>({
        defaultValues: { files: [] }
    })

    const onFileSubmit = async (data: { files: File[] }) => {
        const { files } = data;
        if (!files || files.length === 0) {
            console.warn('No files to upload');
            return;
        }

        // 1. Build FormData
        const formData = new FormData();
        files.forEach((file) => {
            // 'file' must match the @UseInterceptors key in your NestJS controller
            formData.append('file', file, file.name);
        });

        try {
            // 2. Send via your preconfigured `api` instance
            const response = await api.post('hr-admin/employees/upload-csv', formData, {
                headers: {
                    // Let the browser set the correct multipart boundary
                    'Content-Type': 'multipart/form-data',
                },
            });

            console.log('Server parsed rows:', response.data);
            RESET_FILE()
        } catch (error) {
            console.error('Upload failed:', error);
        }
    };

    return (
        <>
            <Drawer.Stack>
                {/* Batch Upload Drawer */}
                <Drawer position="right" {...stack.register('batch-upload')}>
                    <form onSubmit={FILESUBMIT(onFileSubmit)}>
                        <Stack gap="md" p="md">
                            <Controller
                                name="files"
                                control={FILE_CONTROL}
                                rules={{
                                    validate: (files) => files.length > 0 || 'Please upload at least one CSV file',
                                }}
                                render={({ field: { onChange, value }, fieldState: { error } }) => (
                                    <>
                                        <Dropzone
                                            multiple
                                            accept={{ 'text/csv': ['.csv'] }}
                                            maxSize={30 * 1024 ** 2}
                                            onDrop={onChange}
                                            onReject={() => onChange([])}
                                        >
                                            <div style={{ pointerEvents: 'none' }}>
                                                <Flex justify="center">
                                                    <Dropzone.Accept>
                                                        <IconDownload size={50} color="blue" stroke={1.5} />
                                                    </Dropzone.Accept>
                                                    <Dropzone.Reject>
                                                        <IconX size={50} color="red" stroke={1.5} />
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

                                        {/* Display uploaded file names */}
                                        {value.length > 0 && (
                                            <Stack mt="sm" gap={4}>
                                                {value.map((file, idx) => (
                                                    <Text key={idx} size="sm">
                                                        {file.name}
                                                    </Text>
                                                ))}
                                            </Stack>
                                        )}

                                        {/* Validation error */}
                                        {error && (
                                            <Text color="red" size="sm" mt="xs">
                                                {error.message}
                                            </Text>
                                        )}
                                    </>
                                )}
                            />
                            {isSUCCESS_UPLOAD && <Text c={'green'}>Invite Success</Text>}
                            <Button type="submit" variant="filled" color="gray" loading={FILE_SUBMITTING}>
                                {FILE_SUBMITTING ? "Uploading..." : "Batch Invite"}
                            </Button>
                        </Stack>
                    </form>
                </Drawer>

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

            </Drawer.Stack >
            <Button color="#515977" size="md" radius="xl" onClick={open}>
                + Invite
            </Button>
        </>

    )
}