import { Box, Center, Flex, LoadingOverlay, Paper, RingProgress, Text } from "@mantine/core";
import { useQuery } from "react-query";
import api from "../../../api/api";
import LoaderComponent from '../../V2Components/LoaderComponent'

export default function index({ department }) {

    const { data: PARTICIPATION_RATE, isError: noPARTICIPATION, isLoading: isPARTICIPATIONLOADING } = useQuery({
        queryKey: ['PARTICIPATION_RATE', department],
        queryFn: async ({ queryKey }) => {
            console.log(queryKey)
            const [, department] = queryKey
            const config = department
                ? { params: { department } }
                : {};
            const res = await api.get('participation-rate', config);
            return res.data;
        }
    })

    if (noPARTICIPATION) return <Paper h={100} shadow="sm"><Center h={"100%"}><Text >NO AVAILABLE PARTICIPATION DATAs</Text></Center></Paper>

    if (isPARTICIPATIONLOADING) return <Paper h={100} shadow="sm"><Center h={"100%"}><Text >NO AVAILABLE PARTICIPATION DATA</Text></Center></Paper>

    console.log("=============")
    console.log(PARTICIPATION_RATE)
    console.log("=============")

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