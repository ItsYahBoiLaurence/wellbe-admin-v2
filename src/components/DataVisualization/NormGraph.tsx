import { CompositeChart } from "@mantine/charts"
import { Paper, Stack, Text, Title } from "@mantine/core"
import { useQuery } from "react-query"
import { getNormComparison } from "../../api/apiService"

const NormGraph = ({ filter }) => {

    const { data: norm, isLoading: isNormLoading, error } = useQuery({
        queryKey: ['NormDomain', filter],
        queryFn: getNormComparison
    })

    const transformData = (data) => {
        const newData = Object.keys(data.domains).map(domain => ({
            domain,
            score: data.domains[domain], // Get the correct score
            norm: data.norms[domain] // Get the corresponding norm
        }));
        return newData
    }

    if (!isNormLoading) {
        return (
            <Paper py={'md'} px={'xl'} radius={'md'} w='100%' shadow="xs" sx={{  background: '#3E4954'}}>
                <Stack gap={'sm'}>
                    <Text size="lg" c='white' >Company Wide</Text>
                    <Text size="xl" c='white'>Index vs. Norm</Text>
                    <CompositeChart
                        c='white'
                        w={'100%'}
                        h={250}
                        data={transformData(norm?.data)}
                        dataKey="domain"
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
}

export default NormGraph