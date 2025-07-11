import { Badge, Box, Button, ColorSwatch, Flex, Group, LoadingOverlay, Pagination, Paper, Pill, Progress, SimpleGrid, Stack, Text, Title } from "@mantine/core"
import { IconChevronDown, IconInfoSquareRounded } from '@tabler/icons-react';
import { useQuery } from "react-query";
import { ErrorBoundary } from 'react-error-boundary';
import { Suspense } from 'react';
import { useState } from "react";
import { useNavigate } from "react-router-dom";

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
    interpretation: Interpretation[]
}

interface Interpretation {
    content: string;
    id: string;
    question_id: number;
    score_band: string;
}

interface OneSingleType {
    date: string;
    results: {
        answer: {
            SA: number;
            A: number;
            D: number;
            SD: number;
        },
        question: {
            id: number;
            question: string;
            domain: string;
        },
        respondents: number;
    }[]
}

function chunk<T>(array: T[], size: number): T[][] {
    if (!array.length) {
        return [];
    }
    const head = array.slice(0, size);
    const tail = array.slice(size);
    return [head, ...chunk(tail, size)];
}

const PaginatedData = ({ dataArray }: { dataArray: QuestionAnswerTally[] }) => {

    const [activeCard, setActiveCard] = useState<number | null>(null)
    const [activePage, setPage] = useState(1);
    const chunkedData = chunk(dataArray, 3);

    console.log("=----THIS IS START OF THE DATA----=")
    console.log(chunkedData)
    console.log("=----THIS IS END OFTHE DATA----=")

    const items = <SimpleGrid cols={3} w={'100%'}>
        {chunkedData[activePage - 1].map(({ question, answer }, index) => (
            <Paper py={'xl'} px={'lg'} key={index} shadow="xs">
                <Stack justify="space-between" h={'100%'} gap={'8px'}>
                    <Box h={'42px'}>
                        <Text size={'16px'} style={{ lineHeight: 1.3 }}>{question.question}</Text>
                    </Box>
                    {activeCard == index ? (
                        <Stack gap={'lg'} align="start">
                            <Box>
                                <Text size="18px" ta={'center'} style={{ lineHeight: 1.5 }}>{question.interpretation[0].content}</Text>
                            </Box>
                            <Button variant={'filled'} fullWidth color="#515977" onClick={() => setActiveCard(null)}>Got it!</Button>
                        </Stack>
                    ) : (
                        <Stack gap={'16px'}>
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
                            <Stack gap={2} c={'black'} align="flex-start">
                                <Flex w={'100%'} gap={'lg'}>
                                    <Group flex={.5} justify="space-between" w={'100%'}>
                                        <Text size="sm" fw={500}>Strongly Agree</Text>
                                        <Text size="sm" fw={500}>{answer.SA * 100}%</Text>
                                    </Group>

                                    <Group justify="space-between" w={'100%'} flex={.5}>
                                        <Text size="sm" fw={500}>Agree</Text>
                                        <Text size="sm" fw={500}>{answer.A * 100}%</Text>
                                    </Group>
                                </Flex>
                                <Flex w={'100%'} gap={'lg'}>
                                    <Group justify="space-between" w={'100%'}>
                                        <Text size="sm" fw={500}>Disagree</Text>
                                        <Text size="sm" fw={500}>{answer.D * 100}%</Text>
                                    </Group>
                                    <Group justify="space-between" w={'100%'}>
                                        <Text size="sm" fw={500}>Strongly Disagree</Text>
                                        <Text size="sm" fw={500}>{answer.SD * 100}%</Text>
                                    </Group>
                                </Flex>


                                <Button mt={'md'} rightSection={<IconChevronDown />} variant={'filled'} color="#515977" onClick={() => setActiveCard(index)}>Show Insights</Button>
                            </Stack>
                        </Stack>
                    )}
                </Stack>
            </Paper>
        ))}
    </SimpleGrid>

    return (
        <Stack w={'100%'} align="center" h={'500px'} justify="space-around" gap={0}>
            <Group w={'100%'} h={'100%'}>
                {items}
            </Group>
            <Pagination total={chunkedData.length} radius={'xl'} color="gray" size={'lg'} value={activePage} onChange={setPage} onClick={() => { setActiveCard(null) }} />
        </Stack>

    )
}

const fetchData = async (): Promise<InsightCardType> => {
    const url = import.meta.env.VITE_API_URL;
    const token = localStorage.getItem('CLIENT_TOKEN');

    const res = await fetch(`${url}mayan-admin/generate-data`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });

    if (!res.ok) {
        throw new Error("Failed Fetch");
    }

    const data = await res.json();

    console.log("**************");
    console.log(data);
    console.log("**************");

    return data; // ✅ This is the key fix
};

const SingleInsightCard = () => {
    const navigate = useNavigate()
    const { data } = useQuery<InsightCardType>({
        queryKey: ['QuestionInsight'],
        queryFn: () => fetchData(),
        useErrorBoundary: true,
        suspense: true,
        retry: false
    })

    if (!data) throw new Error("Failed Data")

    return (
        <Paper p={'xl'} w={'100%'} h={'100%'}>
            <Stack w={'100%'} h={'100%'} gap={0}>
                <Group justify="space-between" align="center">
                    <Text size="lg" fw={700}>Employee's Insight Per Question</Text>
                    <Button variant="light" color="black" radius='xl' onClick={() => navigate('/question-insight')}>View More</Button>
                </Group>
                <PaginatedData dataArray={data.results} />
            </Stack>
        </Paper>
    )
}

const InsightCard = () => {
    return (
        <ErrorBoundary fallback={<Paper p={'md'} ta={'center'}>No Data Available!</Paper>}>
            <Suspense fallback={
                <LoadingOverlay
                    h={'100px'}
                    pos={'relative'}
                    visible={true}
                    zIndex={1000}
                    overlayProps={{ radius: 'sm', blur: 20 }}
                    loaderProps={{ color: '#515977', type: 'bars' }}
                />}>
                <SingleInsightCard />
            </Suspense>
        </ErrorBoundary >
    )
}

export default InsightCard