import { Avatar, Box, Center, Group, Paper, SimpleGrid, Stack, Text, Title } from "@mantine/core";
import { getLabel, getStanineScore } from "../../../constants";
import Decreased from '../../../assets/decrease.png'
import Increased from '../../../assets/increase.png'
import Maintained from '../../../assets/maintained.png'

const Domain = ({ domain_title, score }: { domain_title: string, score: number }) => {
    if (score === null) return <Paper h={100}><Center h={"100%"}><Text>NO DATA AVAILABLE</Text></Center></Paper>
    const stanine = getStanineScore(score)
    const Image = score >= 1 && score <= 22 ? Decreased : score >= 23 && score <= 76 ? Maintained : score >= 77 && score <= 100 ? Increased : "NA"
    return (
        <Paper px='xxl' py={'xl'} radius={'lg'}>
            <Group justify="space-between">
                <Box>
                    <Group gap={'lg'}>
                        <Avatar src={Image} size={'lg'} />
                        <Stack gap={0}>
                            <Text fw={700} tt={'capitalize'}>{domain_title}</Text>
                            <Title order={2} fw={700}>{getLabel(stanine)}</Title>
                        </Stack>
                    </Group>
                </Box>
                <Box>
                    <Title c={'#A2A5B0'}>{score}%</Title>
                </Box>
            </Group>
        </Paper>
    )
}

export default function index({ WELLBEING_DATA }) {
    return (
        <SimpleGrid cols={2} spacing={'lg'}>
            <Domain domain_title={"character"} score={WELLBEING_DATA.character} />
            <Domain domain_title={"career"} score={WELLBEING_DATA.career} />
            <Domain domain_title={"connectedness"} score={WELLBEING_DATA.connectedness} />
            <Domain domain_title={"contentment"} score={WELLBEING_DATA.contentment} />
        </SimpleGrid>
    )
}