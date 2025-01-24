import { Avatar, Box, Flex, Paper, Text, Title } from "@mantine/core"
import DECREASE from '../../assets/decrease.png'
import INCREASE from '../../assets/increase.png'
import MAINTAIN from '../../assets/maintained.png'

const DomainCard = ({ title, stanine, score }) => {

    const getLabel = (value) => {

        const result = (value >= 1 && value <= 3)
            ? "Below Average"
            : (value >= 4 && value <= 6)
                ? "Average"
                : (value >= 7 && value <= 9)
                    ? "Above Average"
                    : "Invalid Value";

        return result
    }

    const stanineLabelColor = (label) => {
        const color = label == "Below Average" ? 'red' : label == "Average" ? '#94B8FB' : label == "Above Average" ? '#82BC66' : 'black'
        return color
    }

    const setIcon = (label) => {
        const icon = label == "Below Average" ? DECREASE : label == "Average" ? MAINTAIN : label == "Above Average" ? INCREASE : 'black'
        return icon
    }

    return (
        <Paper p={'xl'} radius={'lg'}>
            <Flex justify={'space-between'} align={'center'}>
                <Flex direction={'row'} align={'center'} gap={20}>
                    <Avatar radius="xs" size={'lg'} src={setIcon(getLabel(stanine))} />
                    <Box>
                        <Text fw={500}>{title}</Text>
                        <Text fw={700}>{getLabel(stanine)}</Text>
                        <Text
                            size="xs"
                            c={stanineLabelColor(getLabel(stanine))}
                        >Stanine: {stanine}</Text>
                    </Box>
                </Flex>
                <Title order={2}>{score}%</Title>
            </Flex>
        </Paper>
    )
}

export default DomainCard