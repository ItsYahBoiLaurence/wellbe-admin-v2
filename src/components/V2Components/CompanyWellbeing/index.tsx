import { Avatar, Box, Group, Paper, SimpleGrid, Stack, Text, Title } from "@mantine/core";
import { useQuery } from "react-query";
import api from "../../../api/api";
import { getLabel, getStanineScore } from "../../../constants";
import Decreased from '../../../assets/decrease.png'
import Increased from '../../../assets/increase.png'
import Maintained from '../../../assets/maintained.png'

const Domain = ({ domain_title, score }: { domain_title: string, score: number }) => {

    const stanine = getStanineScore(score)
    const Image = score >= 1 && score <= 22 ? Decreased : score >= 23 && score <= 76 ? Maintained : score >= 77 && score <= 100 ? Increased : "NA"
    return (
        <Paper p='md'>
            <Group justify="space-between">
                <Box>
                    <Group gap={'lg'}>
                        <Avatar src={Image} size={'lg'} />
                        <Stack gap={'sm'}>
                            <Text tt={'capitalize'}>{domain_title}</Text>
                            <Title order={2} fw={700}>{getLabel(stanine)}</Title>
                            <Text>Stanine: {stanine}</Text>
                        </Stack>
                    </Group>
                </Box>
                <Box>
                    <Title>{score}%</Title>
                </Box>
            </Group>
        </Paper>
    )
}

export default function index({ period }: { period: string }) {

    const { data: WELLBEING_DATA, isError: noWELLBEING_DATA, isLoading: isFETCHING_DATA } = useQuery({
        queryKey: ['WELLBEING_DATA', period],
        queryFn: async () => {
            const config = period
                ? { params: { period } }
                : {}

            const res = await api.get('wellbeing/company', config)
            return res.data
        }
    })

    if (isFETCHING_DATA) return <>fetching...</>

    if (noWELLBEING_DATA) return <>no data!</>

    console.log(WELLBEING_DATA)

    return (
        <SimpleGrid cols={2}>
            <Domain domain_title={"character"} score={WELLBEING_DATA.character} />
            <Domain domain_title={"career"} score={WELLBEING_DATA.career} />
            <Domain domain_title={"connectedness"} score={WELLBEING_DATA.connectedness} />
            <Domain domain_title={"contentment"} score={WELLBEING_DATA.contentment} />
        </SimpleGrid>
    )
}