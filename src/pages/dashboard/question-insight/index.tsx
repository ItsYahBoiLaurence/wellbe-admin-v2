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

interface Question {
    id: number;
    question: string;
    domain: string;
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

const PaginatedData = () => {

    const tip = "Many employees feel proud to be part of their organization, indicating strong workplace engagement. To build on this, leadership can highlight employee achievements regularly and foster open communication to sustain a positive work environment."
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
                                        <Text ta={'center'}>{index}</Text>
                                        <Text>{tip}</Text>
                                    </Box>
                                    <Button fullWidth onClick={() => setActiveCard(null)}>Got it!</Button>
                                </>
                            ) : (
                                <Stack gap={'12px'}>
                                    <Text size={'28px'} fw={500}>{`${(answer.SA + answer.A) * 100}% Agree`}</Text>
                                    <Stack gap={0}>
                                        <Progress.Root size={24} style={{ borderRadius: '12px' }}>
                                            <Progress.Section value={(answer.SA + answer.A) * 100} color="#82BC66" />
                                            <Progress.Section value={(answer.D + answer.SD) * 100} color="#FF5A5A" />
                                        </Progress.Root>
                                        <Group justify="space-between" >
                                            {(answer.SA + answer.A) > 0 && <Text fw={500} c="#82BC66">Agree</Text>}
                                            {(answer.D + answer.SD) > 0 && <Text fw={500} c="#FF5A5A">Disagree</Text>}
                                        </Group>
                                    </Stack>
                                    <Stack gap={2} c={'grey'} align="flex-start">
                                        <Group justify="space-between" w={'100%'}>
                                            <Text fw={500}>Strongly Agree</Text>
                                            <Text fw={500}>{answer.SA * 100}%</Text>
                                        </Group>
                                        <Group justify="space-between" w={'100%'}>
                                            <Text fw={500}>Agree</Text>
                                            <Text fw={500}>{answer.A * 100}%</Text>
                                        </Group>
                                        <Group justify="space-between" w={'100%'}>
                                            <Text fw={500}>Disagree</Text>
                                            <Text fw={500}>{answer.D * 100}%</Text>
                                        </Group>
                                        <Group justify="space-between" w={'100%'}>
                                            <Text fw={500}>Strongly Disagree</Text>
                                            <Text fw={500}>{answer.SD * 100}%</Text>
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