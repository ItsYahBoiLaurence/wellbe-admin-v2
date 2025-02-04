import { Box, ColorSwatch, Group, Paper, Pill, Progress, Stack, Text, Title } from "@mantine/core"

const InsightCard = () => {
    const value = 60
    const question = "I find the work that I do repetitive"
    const insight = "of survey respondents stated that they have difficulty keeping up with the demands of work"
    return (
        <Paper p='md' withBorder w={'30%'}>
            <Stack gap='xl'>
                <Stack gap='md'>
                    <Box>
                        <Text ta='center' size="sm">Item 1</Text>
                        <Text ta='center' size="lg" fw={700}>{question}</Text>
                    </Box>
                    <Group justify="center">
                        {/* <ColorSwatch color="#A5D38F" />Agree
                        <ColorSwatch color="#FF9999" />Disaggree */}
                        <Pill bg="#A5D38F">Agree</Pill>
                        <Pill bg="#FF9999">Disagree</Pill>
                    </Group>
                </Stack>
                <Group gap="xs" grow>
                    <Progress
                        value={value}
                        w={150}
                        h={60}
                        style={{ transform: 'rotate(-90deg)' }}
                        bg="#A5D38F"
                        color="#FF9999"
                    />
                    <Box>
                        <Title order={2} fw={700} ta='center'>{value}%</Title>
                        <Text ta='center' size="sm">{insight}</Text>
                    </Box>
                </Group>
            </Stack >
        </Paper >
    )
}

export default InsightCard