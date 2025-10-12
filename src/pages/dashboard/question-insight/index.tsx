import { Box, Button, Group, Pagination, Paper, Progress, SimpleGrid, Stack, Text } from "@mantine/core";
import { Link } from "react-router-dom";
import { IconChevronDown, IconChevronLeft } from '@tabler/icons-react';
import { useQuery } from "react-query";
import { ErrorBoundary } from "react-error-boundary";
import { Suspense, useState } from "react";

interface InsightCardType {
    results: QuestionAnswerTally[];
    date: string;
}

interface QuestionAnswerTally {
    answer: Answer;
    question: Question;
    respondents: number;
}

interface Answer {
    SA: number;
    A: number;
    D: number;
    SD: number;
}

interface Interpretation {
    content: string
}

interface Question {
    id: number;
    question: string;
    domain: string;
    interpretation: Interpretation[]
}

enum DomainType {
    TotalAgreePercentage,
    TotalDisagreePercentage,
    StronglyAgreePercentage,
    AgreePercentage,
    DisagreePercentage,
    StronglyDisagreePercentage
}

const fetchData = async () => {
    const url = import.meta.env.VITE_API_URL
    const token = localStorage.getItem('CLIENT_TOKEN')
    try {
        const response = await fetch(
            `${url}mayan-admin/generate-data`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        )
        const data = await response.json()
        return data
    } catch (error) {
        throw error
    }
}

function chunk<T>(array: T[], size: number): T[][] {
    if (!array.length) {
        return [];
    }
    const head = array.slice(0, size);
    const tail = array.slice(size);
    return [head, ...chunk(tail, size)];
}

function getPercentage(answer: Answer, domainType: DomainType) {
    const total = answer.SA + answer.A + answer.D + answer.SD;

    switch (domainType) {
        case DomainType.TotalAgreePercentage:
            const tap = ((answer.SA + answer.A) / total) * 100
            return Number(tap.toFixed(2))

        case DomainType.TotalDisagreePercentage:
            const tdp = ((answer.SD + answer.D) / total) * 100;
            return Number(tdp.toFixed(2))

        case DomainType.StronglyAgreePercentage:
            const sap = (answer.SA / total) * 100;
            return Number(sap.toFixed(2))
        case DomainType.AgreePercentage:
            const ap = (answer.A / total) * 100;
            return Number(ap.toFixed(2))

        case DomainType.DisagreePercentage:
            const dp = (answer.D / total) * 100;
            return Number(dp.toFixed(2))
        case DomainType.StronglyDisagreePercentage:
            const sdp = (answer.SD / total) * 100;
            return Number(sdp.toFixed(2))
        default:
            return 0
    }
}

const PaginatedData = () => {
    const [activeCard, setActiveCard] = useState<number | null>(null)
    const [activePage, setPage] = useState(1);

    const { data } = useQuery<InsightCardType>({
        queryKey: ['QuestionInsightSP'],
        queryFn: () => fetchData(),
        retry: false,
        useErrorBoundary: true,
        suspense: true
    })

    if (!data) throw new Error("Failed to fetch Data!")
    const chunkedData = chunk(data.results, 9)
    return (
        <Stack justify="space-between" align="center" p={'md'}>
            <SimpleGrid cols={3} w={'100%'}>
                {chunkedData[activePage - 1].map(({ answer, question }, index) => (
                    <Paper py={'md'} px={'md'} key={index} shadow="xs" w={'100%'}>
                        <Stack justify="space-between" h={'100%'} gap={'8px'} >
                            <Box h={'42px'}>
                                <Text size={'16px'} style={{ lineHeight: 1.3 }}>{question.question}</Text>
                            </Box>
                            {activeCard == index ? (
                                <>
                                    <Box>
                                        <Text>{question.interpretation[0].content}</Text>
                                    </Box>
                                    <Button fullWidth onClick={() => setActiveCard(null)} color="#515977">Got it!</Button>
                                </>
                            ) : (
                                <Stack gap={'12px'}>
                                    <Text size={'28px'} fw={500}>{`${getPercentage(answer, DomainType.TotalAgreePercentage)}% Agree`}</Text>
                                    <Stack gap={0}>
                                        <Progress.Root size={24} style={{ borderRadius: '12px' }}>
                                            <Progress.Section value={getPercentage(answer, DomainType.TotalAgreePercentage)} color="#82BC66" />
                                            <Progress.Section value={getPercentage(answer, DomainType.TotalDisagreePercentage)} color="#FF5A5A" />
                                        </Progress.Root>
                                        <Group justify="space-between" >
                                            {(answer.SA + answer.A) > 0 && <Text fw={500} c="#82BC66">Agree</Text>}
                                            {(answer.D + answer.SD) > 0 && <Text fw={500} c="#FF5A5A">Disagree</Text>}
                                        </Group>
                                    </Stack>
                                    <Stack gap={2} c={'grey'} align="flex-start">
                                        <Group justify="space-between" w={'100%'}>
                                            <Text fw={500}>Strongly Agree</Text>
                                            <Text fw={500}>{getPercentage(answer, DomainType.StronglyAgreePercentage)}%</Text>
                                        </Group>
                                        <Group justify="space-between" w={'100%'}>
                                            <Text fw={500}>Agree</Text>
                                            <Text fw={500}>{getPercentage(answer, DomainType.AgreePercentage)}%</Text>
                                        </Group>
                                        <Group justify="space-between" w={'100%'}>
                                            <Text fw={500}>Disagree</Text>
                                            <Text fw={500}>{getPercentage(answer, DomainType.DisagreePercentage)}%</Text>
                                        </Group>
                                        <Group justify="space-between" w={'100%'}>
                                            <Text fw={500}>Strongly Disagree</Text>
                                            <Text fw={500}>{getPercentage(answer, DomainType.StronglyDisagreePercentage)}%</Text>
                                        </Group>
                                        <Button mt={8} rightSection={<IconChevronDown />} variant={'filled'} color="#515977" onClick={() => setActiveCard(index)}>Show Insights</Button>
                                    </Stack>
                                </Stack>
                            )}
                        </Stack>
                    </Paper>
                ))}
            </SimpleGrid>
            <Pagination total={chunkedData.length} radius={'xl'} color="gray" size={'lg'} value={activePage} onChange={setPage} onClick={() => { setActiveCard(null) }} />
        </Stack>
    )
}

export default function QuestionInsight() {



    return (
        <Stack gap={0}>
            <Link to="/" style={{ textDecoration: 'none' }}>
                <Group gap={'4px'}>
                    <IconChevronLeft />
                    <Text> Back to Dash board</Text>
                </Group>
            </Link>
            <ErrorBoundary fallback={<>Error Loading/Fetching data!</>}>
                <Suspense fallback={<>Loading...</>}>
                    <PaginatedData />
                </Suspense>
            </ErrorBoundary>
        </Stack>
    )
}