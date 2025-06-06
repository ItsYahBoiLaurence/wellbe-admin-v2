import { Button, Group, Stack, Text } from '@mantine/core';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import { useQuery } from 'react-query';
import axios from 'axios';
import api from '../../api/api';

// Create an Axios instance with default configurations
const apiClient = axios.create({
    baseURL: 'https://wellbe-api-v1-be2pq63lj-andrew-santos-projects.vercel.app',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add the authorization token to each request
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('ADMIN_TOKEN');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

const Index = () => {
    // Function to send the batch
    const handleSendBatch = async () => {
        try {
            const response = await api.get('batch');
            refetchBATCH()
            console.log(response.data);
            notifications.show({
                title: <Text fw={700} size='md' mb={'sm'}>Survey Batch Released!</Text>,
                message: (
                    <Stack>
                        <Text c={'black'} size='sm'>You have successfully released the survey batch. Employees will receive their surveys shortly.</Text>
                        <Text c={'black'} size='sm'><span style={{ fontWeight: 700 }}>Note: </span>Dashboard and Analytics will update once <span style={{ fontWeight: 700 }}>30% of employees</span> have completed their surveys.</Text>
                    </Stack>
                ),
                position: 'top-center',
                py: "md"
            });
        } catch (error) {
            console.error('Error sending batch:', error);
            notifications.show({
                title: <Text fw={700} size='md' mb={'sm'}>Error</Text>,
                message: <Text c={'black'} size='sm'>Failed to send the survey batch. Please try again later.</Text>,
                color: 'red',
                position: 'top-center',
                py: "md"
            });
        }
    };

    // Function to format the date
    const formatDate = (isoString: string) => {
        const date = new Date(isoString);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    };

    const openModal = () => {
        modals.openConfirmModal({
            title: <Text fw={700}>Release Survey Batch?</Text>,
            children: (
                <Stack gap={'md'}>
                    <Text size="sm">Are you sure you want to release this survey batch?</Text>
                    <Text c={'black'} size='sm' fw={700}>Note: Only employees who have successfully registered will receive the email notification to answer the survey.</Text>
                    <Text size='sm'>Once released, employees will receive their surveys and responses will start coming in.</Text>
                </Stack>
            ),
            labels: { confirm: 'Confirm', cancel: 'Cancel' },
            onCancel: () => console.log('Batch release cancelled'),
            onConfirm: handleSendBatch,
        });
    };

    const { data: BATCH, isError: noBATCH, isLoading: isFETCHINGBATCH, refetch: refetchBATCH } = useQuery({
        queryKey: ['BATCH_DATA'],
        queryFn: async () => {
            const res = await api.get('batch/latest')
            return res.data
        }
    })

    if (noBATCH) return

    if (isFETCHINGBATCH) return <>Fetching...</>

    console.log(BATCH, 'ksksksksks')

    return (
        <Group>
            {!BATCH.is_completed && <Text>
                Batch Overview: <span style={{ fontWeight: 700 }}>{formatDate(BATCH.created_at)}</span>
            </Text>}

            <Button onClick={openModal} disabled={!BATCH.is_completed} color={"#515977"} autoContrast>
                Send Batch Survey
            </Button>
        </Group>
    );
};

export default Index;
