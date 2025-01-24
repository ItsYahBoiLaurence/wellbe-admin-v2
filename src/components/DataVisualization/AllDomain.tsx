import { SimpleGrid } from "@mantine/core"
import DomainCard from "./DomainCard"

const data = [
    {
        title: "Character",
        stanine: 9,
        score: 80,
    },
    {
        title: "Career",
        stanine: 5,
        score: 80,
    },
    {
        title: "Connectedness",
        stanine: 3,
        score: 80,
    },
    {
        title: "Contentment",
        stanine: 3,
        score: 80,
    }
]


const AllDomain = () => {
    return (
        <SimpleGrid cols={2}>
            {data.map((domain) => (
                <DomainCard title={domain.title} stanine={domain.stanine} score={domain.score} />
            ))}
        </SimpleGrid>
    )
}

export default AllDomain