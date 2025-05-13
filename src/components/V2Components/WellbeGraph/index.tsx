import { useQuery } from "react-query"
import api from "../../../api/api"
import { Center, Paper, Stack, Text, Title } from "@mantine/core"
import { LineChart } from "@mantine/charts"

export default function index({ period }: { period: string }) {

    const { data: WELLBE_DATA, isError: noWELLBE_DATA, isLoading: isFETCHINGDATA } = useQuery({
        queryKey: ['WELLBE_DATA', period],
        queryFn: async () => {
            const config = period
                ? { params: { period } }
                : {}
            const res = await api.get('wellbeing/wellbe', config)
            return res.data
        }
    })

    if (isFETCHINGDATA) return <>fetching...</>
    if (noWELLBE_DATA) return <>No Data</>


    const data: { date: string, wellbeing: number }[] = []

    WELLBE_DATA.map(({ created_at, wellbeing }: { created_at: string, wellbeing: number }) => {
        const date = new Date(created_at)
        const formatted = date.toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
        });
        data.push({ date: formatted, wellbeing })
    })

    console.log(data)
    if (data.length === 0) return <Paper h={400}><Center h={"100%"}><Text>NO DATA AVAILABLE</Text></Center></Paper>
    return (
        <Paper p='md'>
            <Stack>
                <Title order={2}>Company Wellbeing</Title>
                <LineChart
                    h={300}
                    data={data}
                    dataKey="date"
                    series={[{ name: 'wellbeing' }]}
                    curveType="monotone"
                />
            </Stack>
        </Paper>
    )
}