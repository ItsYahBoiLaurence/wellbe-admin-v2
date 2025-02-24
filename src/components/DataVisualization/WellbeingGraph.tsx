import { AreaChart } from "@mantine/charts"
import { Paper, Stack, Text, Title } from "@mantine/core"
import { useQuery } from "react-query"
import { getWellbe } from "../../api/apiService"

const WellbeingGraph = ({ filter }) => {

    const { data: wellBe, isLoading: isWellBeLoading } = useQuery({
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

    if (!isWellBeLoading) {
        return (
            <div>
                <Paper p={'xl'} radius={'md'} w='100%'>
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




{/* <Paper p={'xl'} radius={'md'} w='100%'>
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
                </Paper> */}