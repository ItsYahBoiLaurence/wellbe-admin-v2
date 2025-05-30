import { BarChart } from "@mantine/charts"
import { getLabel, getStanineScore, labelColor, setIcon } from "../../constants"

const DomainBarGraph = (domainData) => {

    const transformData = (data) => {
        const newFormat = Object.entries(data).map(([key, value]) => ({
            domain: key,
            score: value
        }))
        return newFormat
    }

    return (
        <BarChart
            w={'100%'}
            h={150}
            data={transformData(domainData)}
            dataKey="domain"
            series={[{ name: 'score' }]}
            getBarColor={(value) => labelColor(getLabel(getStanineScore(value)))}
        />
    )
}

export default DomainBarGraph