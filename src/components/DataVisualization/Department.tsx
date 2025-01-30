import { Avatar, Box, Drawer, Flex, Image, Paper, ScrollArea, Stack, Text } from "@mantine/core"
import DECREASE from '../../assets/LowAverage.png'
import INCREASE from '../../assets/AboveAverage.png'
import MAINTAIN from '../../assets/MaintainedScore.png'



const DepartmentWellbeing = ({ departments }) => {

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
        const color = label == "Below Average" ? 'red' : label == "Average" ? '#94B8FB' : label == "Above Average" ? '#00A389' : 'black'
        return color
    }

    const setIcon = (label) => {
        const icon = label == "Below Average" ? DECREASE : label == "Average" ? MAINTAIN : label == "Above Average" ? INCREASE : 'black'
        return icon
    }

    return (
        <Box>
            <ScrollArea w={'100%'}>
                <Flex direction={'row'} gap={'md'}>
                    {departments.map((department) => (
                        <Paper key={department.departmentName} shadow="xs" radius="md" p="xl" w={'350px'} >
                            <Box>
                                <Flex align={'center'} gap={12}>
                                    <Avatar size={'lg'} color={labelColor(getLabel(department.Wellbe))} >{department.departmentName[0]}</Avatar>
                                    <Text fw={700} size="lg">{department.departmentName}</Text>
                                </Flex>
                                <Flex justify={'space-between'} align={"center"} my={"md"}>
                                    <Box>
                                        <Text c={labelColor(getLabel(department.Wellbe))} fw={700} size="xl">{getLabel(department.Wellbe)}</Text>
                                        <Text c={labelColor(getLabel(department.Wellbe))}>{department.Wellbe}%</Text>
                                    </Box>
                                    <Box>
                                        <Avatar radius="xs" size={'xl'} src={setIcon(getLabel(department.Wellbe))} />
                                    </Box>
                                </Flex>
                            </Box>
                        </Paper>
                    ))}
                </Flex>
            </ScrollArea>
        </Box>

    )
}

export default DepartmentWellbeing