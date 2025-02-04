import { Paper, Stack, Text } from "@mantine/core"

const FeedbackCard = () => {
    const text = "Sed eligendi facere repellendus. Ipsam ipsam incidunt minima harum tenetur. Ab sit asperiores architecto repudiandae."
    const created = "5 days ago"
    return <Paper p='md' shadow="xs" radius='md' >
        <Stack justify="space-around">
            <Text lineClamp={4}>{text}</Text>
            <Text c="dimmed">{created}</Text>
        </Stack>
    </Paper>
}

export default FeedbackCard