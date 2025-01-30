import { Box, SimpleGrid, Text } from "@mantine/core"
import DomainCard from "./DomainCard"

const AllDomain = ({ domains }) => {
    return (<Box>
        {(domains === null || domains === undefined) ? <Text>Loading...</Text> : <SimpleGrid cols={2}>
            {Object.entries(domains).map(([key, value]) => (
                <DomainCard key={key} title={key} score={value} />
            ))}
        </SimpleGrid>}

    </Box>

    )
}

export default AllDomain