import { Box, Center, Paper, SimpleGrid, Text } from "@mantine/core"
import DomainCard from "./DomainCard"

const AllDomain = ({ domains }) => {
    return (<Box>
        {(domains === null || domains === undefined) ? <Paper w='100%' p='md'><Center h='100%'><Text>No data available!</Text></Center></Paper> : <SimpleGrid cols={2}>
            {Object.entries(domains).map(([key, value]) => (
                <DomainCard key={key} title={key} score={value} />
            ))}
        </SimpleGrid>}

    </Box>

    )
}

export default AllDomain