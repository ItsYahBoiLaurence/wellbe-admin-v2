import { Avatar, Box, Flex, Paper, Stack, Text } from "@mantine/core"
import DECREASE from '../../assets/decrease.png'
import INCREASE from '../../assets/increase.png'
import MAINTAIN from '../../assets/maintained.png'



const DepartmentWellbeing = ({ department, wellbeingScore }) => {

    const getLabel = (value) => {

        const result = (value >= 1 && value <= 71)
            ? "Below Average"
            : (value >= 72 && value <= 87)
                ? "Average"
                : (value >= 88 && value <= 100)
                    ? "Above Average"
                    : "Invalid Value";

        return result
    }

    const labelColor = (label) => {
        const color = label == "Below Average" ? 'red' : label == "Average" ? '#94B8FB' : label == "Above Average" ? '#82BC66' : 'black'
        return color
    }

    const setIcon = (label) => {
        const icon = label == "Below Average" ? DECREASE : label == "Average" ? MAINTAIN : label == "Above Average" ? INCREASE : 'black'
        return icon
    }

    return (
        <Paper shadow="xs" radius="md" p="xl" w={'100%'}>
            <Stack>
                <Flex align={'center'} gap={12}>
                    <Avatar>{department[0]}</Avatar>
                    <Text>{department}</Text>
                </Flex>
                <Flex justify={'space-between'} align={"center"}>
                    <Box>
                        <Text>{getLabel(wellbeingScore)}</Text>
                        <Text c={labelColor(getLabel(wellbeingScore))}>{wellbeingScore}%</Text>
                    </Box>
                    <Avatar radius="xs" size={'lg'} src={setIcon(getLabel(wellbeingScore))} />
                </Flex>
            </Stack>
        </Paper>
    )
}

export default DepartmentWellbeing