import { Box, Flex, Paper, RingProgress, Text } from "@mantine/core"

const ParticipationRate = ({ participationRateData }) => {
    console.log(participationRateData)
    const rate = 80
    return (
        <Paper p='md' radius='md' my={'md'}>
            <Flex direction={'row'} justify={'space-between'} align={'center'} >
                <Box>
                    <Text size="lg" fw={700}>Participation Rate</Text>
                    <Text fw={500}>This summarized the employee's compliance to company activities and initiatives.</Text>
                </Box>
                <Flex align={'center'} gap={'md'}>
                    <Box>
                        <Text fw={700}>Employee Participation</Text>
                        <Text size="xl">{rate}%</Text>
                    </Box>
                    <RingProgress
                        thickness={20}
                        sections={[{ value: rate, color: '#FFA903' }]}
                    />
                </Flex>
            </Flex>
        </Paper>
    )
}

export default ParticipationRate