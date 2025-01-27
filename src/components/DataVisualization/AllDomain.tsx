import { SimpleGrid, Text } from "@mantine/core"
import DomainCard from "./DomainCard"

const AllDomain = ({ domains }) => {
    return (
        <SimpleGrid cols={2}>
            {Object.entries(domains).map(([key, value]) => (
                <DomainCard key={key} title={key} score={value} />
            ))}
        </SimpleGrid>
    )
}

export default AllDomain