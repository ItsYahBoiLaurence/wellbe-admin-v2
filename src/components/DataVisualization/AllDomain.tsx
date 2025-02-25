import { Box, Paper, SimpleGrid, Text } from "@mantine/core"
import DomainCard from "./DomainCard"

const AllDomain = ({ domains }) => {
    return (<Box>
        {(domains === null || domains === undefined) ? <Paper w='100%' p='md'><Text ta='center'>You need to complete at least 1 set of 25 questions</Text></Paper> : <SimpleGrid cols={2}>
            {Object.entries(domains).map(([key, value]) => (
                <DomainCard key={key} title={key} score={value} />
            ))}
        </SimpleGrid>}

    </Box>

    )
}

export default AllDomain