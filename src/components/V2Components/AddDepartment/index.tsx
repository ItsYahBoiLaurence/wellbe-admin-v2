import { Box, Button, Drawer, Flex, Loader, Text, TextInput } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useForm } from "react-hook-form";
import api from "../../../api/api";
import axios from "axios";

export default function index({ refetch }: { refetch: any }) {
    const [openedAddDepartment, { open, close }] = useDisclosure(false);

    const { register, handleSubmit, formState: { isSubmitting, errors }, setError, reset } = useForm({
        defaultValues: {
            department: ""
        }
    })
    const onSubmit = async (data: { department: string }) => {
        try {
            const res = await api.post('department', { name: data.department })
            console.log(res)
            refetch()
            reset()
        } catch (error) {
            console.log(error)
            if (axios.isAxiosError(error)) {
                const status = error.response?.status;
                // 2) Handle 409 Conflict explicitly
                if (status === 409) {
                    setError('department', {
                        type: "custom",
                        message: error.response?.data.message
                    });
                } else {
                    console.error('Unexpected error:', error);
                }
            }
        }
    }
    return (
        <>
            <Drawer.Root key={2} position="right" size="md" opened={openedAddDepartment} onClose={close}>
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
                            <form onSubmit={handleSubmit(onSubmit)} style={{ height: '100%' }}>
                                <Flex direction="column" gap="md" justify="space-between" h="100%" mt="md">
                                    <Box>
                                        <Text mb="md" fw={700}>Department Name</Text>
                                        <Box>
                                            <TextInput
                                                size="lg"
                                                {...register('department', { required: 'Department name is required' })}
                                            />
                                            {errors.department && <Text c={'red'}>{errors.department.message}</Text>}
                                        </Box>
                                        <Text mt="md" size="sm">
                                            Employees in this department will be notified to download the Wellbe companion app and receive company updates.
                                        </Text>
                                    </Box>
                                    <Button disabled={isSubmitting} type="submit" size="lg" color="#515977">
                                        {isSubmitting ? <Loader color="blue" /> : 'Add Department'}
                                    </Button>
                                </Flex>
                            </form>
                        </Box>
                    </Drawer.Body>
                </Drawer.Content>
            </Drawer.Root >
            <Button color="#82BC66" size="md" radius="xl" onClick={open}>+Department</Button>
        </>
    )
}
