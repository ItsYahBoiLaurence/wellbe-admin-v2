import { CompositeChart } from "@mantine/charts";
import { Center, Paper, Stack, Text } from "@mantine/core";

export default function index({ WELLBEING_DATA }) {


    const { career, character, connectedness, contentment } = WELLBEING_DATA

    if (career === null || character === null || connectedness === null || contentment === null) return <Paper h={400}><Center h={"100%"}><Text>NO DATA AVAILABLE</Text></Center></Paper>


    const data = [
        {
            name: "Career",
            score: career,
            norm: 89
        },
        {
            name: "Character",
            score: character,
            norm: 83
        },
        {
            name: "Contentment",
            score: contentment,
            norm: 63
        },
        {
            name: "Connectedness",
            score: connectedness,
            norm: 84
        }
    ]

    return (
        <Paper py={'md'} px={'xl'} radius={'md'} w='100%' shadow="xs" sx={{ background: '#3E4954' }}>
            <Stack gap={'sm'}>
                <Text size="lg" c='white' >Company Wide</Text>
                <Text size="xl" c='white'>Index vs. Norm</Text>
                <CompositeChart
                    c='white'
                    w={'100%'}
                    h={250}
                    data={data}
                    dataKey="name"
                    series={[
                        { name: 'score', color: '#A5D38F', type: 'bar' },
                        { name: 'norm', color: 'white', type: 'line' },
                    ]}
                    withLegend
                    curveType="linear"
                />
            </Stack>
        </Paper>
    )
}