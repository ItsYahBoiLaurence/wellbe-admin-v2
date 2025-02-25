import { AreaChart } from "@mantine/charts"
import { Paper, Stack, Text, Title } from "@mantine/core"
import { useQuery } from "react-query"
import { getWellbe } from "../../api/apiService"

const WellbeingGraph = ({ filter }) => {

    const { data: wellBe, isLoading: isWellBeLoading, error } = useQuery({
        queryKey: ['Wellbe', filter],
        queryFn: getWellbe
    })

    const transformDate = (stringDate) => {
        const date = new Date(stringDate)
        const newDate = date.toLocaleDateString('en-US', {
            month: 'short'
        })
        return newDate
    }

    const transformWellbeingData = (data) => {

        const newData = data.map(entry => ({
            date: transformDate(entry.Date),
            wellbeing: entry.Wellbe
        }))
        return newData
    }

    if (error) return <Paper w='100%' p='md' h='250'><Text ta='center'>You need to complete at least 1 set of 25 questions.</Text></Paper>

    if (!isWellBeLoading) {
        return (
            <div>
                <Paper p={'xl'} radius={'md'} w='100%' shadow="xs">
                    <Stack gap={'lg'}>
                        <Title order={2} fw={700}>Company Well Being Score</Title>
                        <AreaChart
                            h={250}
                            data={transformWellbeingData(wellBe?.data)}
                            dataKey="date"
                            yAxisProps={{ domain: [0, 100] }}
                            series={[{ name: "wellbeing", color: "gray" }]}
                            curveType="natural"
                            withDots={false}
                        />
                    </Stack>
                </Paper>
            </div>
        )
    }
}


export default WellbeingGraph