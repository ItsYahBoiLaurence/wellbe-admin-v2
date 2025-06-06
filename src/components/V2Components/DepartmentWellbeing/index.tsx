import { Avatar, Box, Group, Paper, SimpleGrid, Stack, Text } from "@mantine/core";
import { useQuery } from "react-query";
import api from "../../../api/api";
import { getLabel, getStanineScore, setIcon } from "../../../constants";
import LoaderComponent from '../LoaderComponent'

export default function index({ period }: { period: string }) {
    const { data: DEPARTMENT_DATA, isError: noDEPARTMENT_DATA, isLoading: isFETCHINGDATA } = useQuery({
        queryKey: ['DEPARTMENT_DATA', period],
        queryFn: async () => {
            const config = period
                ? { params: { period } }
                : {}

            const res = await api.get('wellbeing/department', config)
            return res.data
        }
    })

    if (isFETCHINGDATA) return < LoaderComponent />
    if (noDEPARTMENT_DATA) return <>no data...</>

    console.log(DEPARTMENT_DATA)
    return (
        <SimpleGrid cols={4}>
            {DEPARTMENT_DATA.map(({ name, wellbeing }, index) => (
                <Paper key={index} p={'md'}>
                    <Stack justify="space-between" h={'100%'}>
                        <Group>
                            <Avatar>{name[0]}</Avatar>
                            <Box w={'80%'}>
                                <Text size="20px" fw={700}>{name}</Text>
                            </Box>
                        </Group>
                        {wellbeing === null
                            ? <Box h={'60px'}>
                                <Text ta={'center'} fw={700}>No Data</Text>
                            </Box>
                            : <Group justify="space-between">
                                <Stack>
                                    <Text>{getLabel(getStanineScore(wellbeing))}</Text>
                                    <Text>{wellbeing}%</Text>
                                </Stack>
                                <Avatar size='xl' radius='none' src={setIcon(getLabel(getStanineScore(wellbeing)))} />
                            </Group>
                        }
                    </Stack>
                </Paper>
            ))}
        </SimpleGrid>

    )
}