import { Badge, Box, Button, ColorSwatch, Group, Pagination, Paper, Pill, Progress, SimpleGrid, Stack, Text, Title } from "@mantine/core"
import { IconInfoSquareRounded } from '@tabler/icons-react';
import { useQuery } from "react-query";
import { ErrorBoundary } from "react-error-boundary";
import { Suspense, useState } from "react";
import api from "../../api/api";

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
    const [activePage, setPage] = useState(1);
    const chunkedData = chunk(dataArray, 3);
    console.log(chunkedData);
    return (
        <>
            <SimpleGrid cols={3}>
                {chunkedData[activePage - 1].map((item, index) => (
                    <Text key={index}>asd</Text>
                ))}
            </SimpleGrid>
            <Pagination total={dataArray.length} value={activePage} onChange={setPage}></Pagination>
        </>

    )
}

const SingleInsightCard = () => {

    const tip = "Many employees feel proud to be part of their organization, indicating strong workplace engagement. To build on this, leadership can highlight employee achievements regularly and foster open communication to sustain a positive work environment."

    const [activeCard, setActiveCard] = useState<number | null>(null)

    const { data } = useQuery<OneSingleType>({
        queryKey: ['questionInsight'],
        queryFn: async () => {
            const res = await api.get('/mayan-admin/generate-data/')
            return res.data
        }
    })

    return (
        <>
            {data?.results.map(({ question, answer }, index) => (
                <Paper py={'xl'} px={'lg'} key={index}>
                    <Stack justify="space-between" h={'100%'} gap={'8px'} >
                        <Text size={'16px'} style={{ lineHeight: 1.3 }}>{question.question}</Text>
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
                                    <Progress.Root size={20} style={{ borderRadius: '8px' }}>
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
                                    <Group justify="space-between">
                                        <Text fw={500}>Agree</Text>
                                        <Text fw={500}>{answer.A * 100}%</Text>
                                    </Group>
                                    <Group justify="space-between">
                                        <Text fw={500}>Disagree</Text>
                                        <Text fw={500}>{answer.D * 100}%</Text>
                                    </Group>
                                    <Group justify="space-between">
                                        <Text fw={500}>Strongly Disagree</Text>
                                        <Text fw={500}>{answer.SD * 100}%</Text>
                                    </Group>
                                    <Button mt={'md'} leftSection={<IconInfoSquareRounded />} variant={'filled'} color="#515977" onClick={() => setActiveCard(index)}>Show Insights</Button>
                                </Stack>
                            </Stack>
                        )}
                    </Stack>
                </Paper>
            ))}
        </>
    )
}

const InsightCard = () => {
    return (
        <SimpleGrid cols={3}>
            <ErrorBoundary fallback={<Box>Error loading insights</Box>}>
                <Suspense fallback={<Box>Loading...</Box>}>
                    <SingleInsightCard />
                </Suspense>
            </ErrorBoundary >
        </SimpleGrid >
    )
}

export default InsightCard