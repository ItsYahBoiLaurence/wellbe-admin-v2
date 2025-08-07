import { Avatar, Box, Button, Center, Group, LoadingOverlay, Paper, SimpleGrid, Stack, Text, Title } from "@mantine/core";
import Decreased from '../../../assets/decrease.png'
import Increased from '../../../assets/increase.png'
import Maintained from '../../../assets/maintained.png'
import { useQuery } from "react-query";
import api from "../../../api/api";
import { useState } from "react";
import { IconChevronDown, IconChevronUp } from "@tabler/icons-react";

interface WellbeingDomain {
    domain: string
    stanine_score: number
    stanine_label: string
    insight: string
    to_do: string
}

type StanineLabel = "Very High" | "Above Average" | "Average" | "Below Average" | "Very Low";

const Domain = ({ wellbeingDomain }: { wellbeingDomain: WellbeingDomain }) => {

    const [show, setShow] = useState(false)

    const imgMap: Record<StanineLabel, string> = {
        "Very High": Increased,
        "Above Average": Increased,
        "Below Average": Decreased,
        "Very Low": Decreased,
        "Average": Maintained
    }

    const Image = imgMap[wellbeingDomain.stanine_label as StanineLabel]

    return (
        <Paper px='xxl' py={'xl'} radius={'lg'} h={show ? undefined : 170}>
            <Group justify="space-between">
                <Box>
                    <Group gap={'lg'}>
                        <Avatar src={Image} size={'lg'} />
                        <Stack>
                            <Stack gap={0} align="start">
                                <Text fw={700} tt={'capitalize'}>{wellbeingDomain.domain}</Text>
                                <Title order={2} fw={700}>{wellbeingDomain.stanine_label}</Title>
                            </Stack>
                            <Button w={125} onClick={() => setShow(!show)} color="#515977" rightSection={show ? <IconChevronUp /> : <IconChevronDown />}>
                                <Text size="xs">{show ? "Hide Insight" : "Show Insight"}</Text>
                            </Button>
                        </Stack>
                    </Group>
                </Box>
                <Box>
                    <Title c={'#A2A5B0'}>{wellbeingDomain.stanine_score}%</Title>
                </Box>
            </Group>
            {show && (
                <Stack>
                    <Stack gap={0}>
                        <Text fw={700}>Insight:</Text>
                        <Text>{wellbeingDomain.insight}</Text>
                    </Stack>
                    <Stack gap={0}>
                        <Text fw={700}>What to build on:</Text>
                        <Text>{wellbeingDomain.to_do}</Text>
                    </Stack>
                </Stack>
            )}
        </Paper>
    )
}

export default function index({ period }: { period: string }) {

    const { data, isError, isLoading } = useQuery<WellbeingDomain[]>({
        queryKey: ['wellbeing-domain-data', period],
        queryFn: async () => {
            const config = period
                ? { params: { period } }
                : {}
            const res = await api.get('/wellbeing/domain-insight', config)
            return res.data
        }
    })

    if (isLoading) return <Paper h={100}><Center h={"100%"}><Text>NO DATA AVAILABLE</Text></Center></Paper>

    if (isError) return <Paper h={100}><Center h={"100%"}><Text>NO DATA AVAILABLE</Text></Center></Paper>

    console.log("*****DOMAIN INSIGHT DATA******")
    console.log(data)
    console.log("***********")

    return (
        <SimpleGrid cols={2} spacing={'lg'}>
            {data?.map((domain, index) => (
                <Domain key={index} wellbeingDomain={domain} />
            ))}
        </SimpleGrid>
    )
}