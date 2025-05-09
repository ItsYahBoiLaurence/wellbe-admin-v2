import { Box, Flex, Paper, RingProgress, Text } from "@mantine/core";
import { useQuery } from "react-query";
import api from "../../../api/api";

export default function index({ department }) {

    const { data: PARTICIPATION_RATE, isError: noPARTICIPATION, isLoading: isPARTICIPATIONLOADING } = useQuery({
        queryKey: ['PARTICIPATION_RATE', department],
        queryFn: async ({ queryKey }) => {
            console.log(queryKey)
            const [, department] = queryKey
            // Build the request config: either { params: { department } } or empty object
            const config = department
                ? { params: { department } }
                : {};

            // Single GET, axios will omit undefined params automatically
            const { data } = await api.get('participation-rate', config);
            return data;
        }
    })

    if (isPARTICIPATIONLOADING) return <>fetching...</>

    if (noPARTICIPATION) return <>no participation</>

    console.log(PARTICIPATION_RATE)

    const { participation_rate } = PARTICIPATION_RATE
    return (
        <Paper p='md' radius='md' my={'md'}>
            <Flex direction={'row'} justify={'space-between'} align={'center'} >
                <Box>
                    <Text size="lg" fw={700}>Participation Rate</Text>
                    <Text fw={500}>This summarized the employee's compliance to company activities and initiatives.</Text>
                </Box>
                <Flex align={'center'} gap={'md'}>
                    <Box>
                        <Text fw={700}>Employee Participation</Text>
                        <Text size="xl">{participation_rate * 100}%</Text>
                    </Box>
                    <RingProgress
                        thickness={20}
                        sections={[{ value: participation_rate * 100, color: '#FFA903' }]}
                    />
                </Flex>
            </Flex>
        </Paper>
    )
}